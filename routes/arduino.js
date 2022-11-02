const express = require('express');
var router = express.Router();

// 초기 아두이노 셋팅
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

// 아두이노 데이터 송수신
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
                                    manual: optionResult.manual, // 이 값에 따라 아두이노는 창문을 열거나 닫아야 함
                                    optionHumid: "null",
                                    optionTemp: "null"
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
                        autoMode: "on",
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