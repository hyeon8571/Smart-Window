const express = require('express');
var router = express.Router();
/*
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../fcmtest-3a188-firebase-adminsdk-x385i-f6546d024e.json')

// firebase 연결
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
})
*/

router.get('/register', (req, res) => {
    req.app.db.collection('serial').findOne({ serialNum: req.query.serialNum }, (err, result) => {  //꺼졌다 켜졌을때 대비
        if (result == null) {
            req.app.db.collection('serial').insertOne({ serialNum: req.query.serialNum, registration: "N" }, (err, result) => {
                if (err) {
                    res.json({ check: "false" });
                } else {
                    res.json({ check: "true" });
                }
            }
            )
            req.app.db.collection('mode').insertOne({ serialNum: req.query.serialNum, automode: 'on' }, (err, result) => {

            })
            req.app.db.collection('option').insertOne({ serialNum: req.query.serialNum, temp: '26', humid: '60', manual: 'null' }, (err, result) => {

            })
        } else {
            res.json({ check: "true" });
        }
    })


})

router.get('/sensing', (req, res) => {

    // register로 등록할 때 먼저 삽입
    req.app.db.collection('data-serial').findOne({ serialNum: req.query.serialNum }, (err, result) => {

        var updated =
        {
            temperature: req.query.temp,
            humidity: req.query.humid,
            rain: req.query.rain,
            gas: req.query.gas,
            state: req.query.state
        };

        var inserted =
        {
            serialNum: req.query.serialNum,
            temperature: req.query.temp,
            humidity: req.query.humid,
            rain: req.query.rain,
            gas: req.query.gas,
            state: req.query.state
        };

        if (req.query.gas == "true") {
            req.app.db.collection('log').insertOne({ serialNum: req.query.serialNum, Date: new Date() }, (err, result) => {
                console.log(result);
            })

            req.app.db.collection('user-serial').findOne({ serialNum: req.query.serialNum }, (err, result) => {
                req.app.db.collection('user').findOne({ ID: result.ID }, (에러, 결과) => {

                    var message = {
                        notification: {
                            title: '경고!!',
                            body: "현재 집안에 가스가 감지되었습니다."
                        }
                        , token: 결과.Token
                    }
                    firebaseAdmin.messaging().send(message)
                        .then((response) => {
                            console.log('메시지 전송 성공 : ', response)
                        })
                        .catch((e) => {
                            console.error('message error : ', e)
                        })
                })
            })
        }

        if (result != null) {
            if ((req.query.temp != result.temperature) || (req.query.humid != result.humidity) || (req.query.rain != result.rain) || (req.query.gas != result.gas) || (req.query.state != result.state)) {
                req.app.db.collection('data-serial').updateOne({ serialNum: req.query.serialNum }, { $set: updated }, (에러, 결과) => {

                })
                req.app.db.collection('mode').findOne({ serialNum: req.query.serialNum }, (err, result) => {
                    req.app.db.collection('option').findOne({ serialNum: req.query.serialNum }, (error, optionResult) => {

                        if (result.automode == "on") {
                            res.json(
                                {
                                    autoMode: result.automode,
                                    manual: "null",
                                    optionHumid: optionResult.humid,
                                    optionTemp: optionResult.temp

                                }
                            );
                        } else {
                            res.json(
                                {
                                    autoMode: result.automode,
                                    manual: optionResult.manual // 이 값에 따라 아두이노는 창문을 열거나 닫아야 함
                                }
                            )
                        }
                    })
                })
            } else {
                req.app.db.collection('mode').findOne({ serialNum: req.query.serialNum }, (err, result) => {
                    req.app.db.collection('option').findOne({ serialNum: req.query.serialNum }, (error, optionResult) => {

                        if (result.automode == "on") {
                            res.json(
                                {
                                    autoMode: result.automode,
                                    manual: "null",
                                    optionHumid: optionResult.humid,
                                    optionTemp: optionResult.temp

                                }
                            );
                        } else {
                            res.json(
                                {
                                    autoMode: result.automode,
                                    manual: optionResult.manual // 이 값에 따라 아두이노는 창문을 열거나 닫아야 함
                                }
                            )
                        }
                    })
                })
            }
        } else {
            req.app.db.collection('data-serial').insertOne(inserted, (에러, 결과) => {
                res.json(
                    {
                        automode: "on",
                        manual: "null",
                        optionHumid: "60",
                        optionTemp: "26"
                    }
                )
            })
        }
    })
})

module.exports = router;
