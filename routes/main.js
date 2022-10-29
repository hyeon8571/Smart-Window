const express = require('express');
const { reset } = require('mongodb/lib/core/connection/logger');
var router = express.Router();

function loginCheck(req, res, next) {
    if (req.user) { 
        next()
    } else {
        res.json('!user')
    }
}

// 앱에 센서가 측정한 데이터들을 보여줌
router.post('/control/data', loginCheck, (req, res) => {
    req.app.db.collection('data-serial').findOne({serialNum : req.body.serialNum}, (err, result) => {
        try {
        res.json(   
            {
                temp : result.temperature, //string
                humid : result.humidity, //string
                gas : result.gas, //string
                state : result.state, //string
                rain : result.rain, //strin
            }
        );   
        } catch (err) {
            res.redirect('/auth/logout')
        }
        
    })
})

// 컨트롤 할 수 있는 창문의 목록을 보여줌
router.post('/control/data-list', (req, res) => {
    req.app.db.collection('user-serial').find({ID : req.body.ID}).toArray(function(err, result) {
        try {
            
        res.json(
            {
                serialList : result 
            }
        )
        } catch (err) {
            res.redirect('/auth/logout')
        }
        
    })
})


// 현재 적용되어 있는 옵션 값을 보여줌
router.post('/option-data', (req, res) => {
    req.app.db.collection('option').findOne({serialNum : req.body.serialNum}, (err, result) => {
        try {
            res.json(
                {
                    temp : result.temp,
                    humid : result.humid,
                }
            );    
        } catch (err) {
            res.redirect('/auth/logout')
        }
        
    })
})

// 옵션 변경 기능 
router.put('/option-change', (req, res) => {
    req.app.db.collection('option').updateOne({serialNum : req.body.serialNum}, {$set : {temp : req.body.temp, humid : req.body.humid}}, (err, result) => {
        res.json(true);
        if(err) {
        res.json(false);
        }
    })
})

// 가스로 인해 창문이 열린 시간을 보여줌
router.post('/log-data', (req, res) => {
    req.app.db.collection('log').find({serialNum : req.body.serialNum}).toArray(function(err, result) {
        try {
            res.json(
                {
                    data : result
                }
            );    
        } catch (err) {
            res.redirect('/auth/logout');
        }
        
    })
})

// 로그 지우기 기능
router.delete('/log-delete', (req,res) => {
    var date = req.body.date + '+00:00'
    req.app.db.collection('log').deleteOne({serialNum : req.body.serialNum, Date : new Date(date)}, (err, result) => {
        res.json(true);
    })
    
})

// 현재 어떤 모드를 사용중인지 보여줌
router.post('/mode', (req, res) => {
    req.app.db.collection('mode').findOne({serialNum : req.body.serialNum}, (err, result) => {
        try {
         
        res.json(
            {
                automode : result.automode
            }
        );   
        } catch (err) {
            res.redirect('/auth/logout')
        }
    })
})

//첫 설치시 아두이노에서 정보 쏴줘서 저장해야함
router.put('/mode-change', (req, res) => {
    req.app.db.collection('mode').updateOne({serialNum : req.body.serialNum}, {$set : {automode : req.body.automode}}, (err, result) => {
        res.json(true);
    })
})

// 수동모드 일 떄 창문을 열고 닫을 수 있는 기능
router.put('/state-change',(req,res)=>{
    req.app.db.collection('option').updateOne({serialNum : req.body.serialNum}, {$set : {manual : req.body.state}}, (err, result) => {
        res.json(true);
        console.log('result');
    })
})

// 새로운 창문 추가 기능
router.post('/add-window', (req, res) => {
    req.app.db.collection('serial').updateOne({serialNum : req.body.serialNum}, {$set : {registration : "Y"}}, (err, result) => {
        if(err) {
          res.json(false);
        }
      })
    
      req.app.db.collection('user-serial').insertOne({serialNum : req.body.serialNum, ID : req.body.ID, location : req.body.location}, (err, result) => {
        if(err) {
          res.json(false);
        }
      })
      res.json(true);
    })


module.exports = router;
