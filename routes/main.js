const e = require('express');
const express = require('express');
const { reset } = require('mongodb/lib/core/connection/logger');
var router = express.Router();




router.post('/control/data', (req, res) => {
    req.app.db.collection('data-serial').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
        try {
        res.json(   
            {
                temp : 결과.temperature, //string
                humid : 결과.humidity, //string
                dust : 결과.dust, //string
                state : 결과.state, //string
                rain : 결과.rain, //string
                gas : 결과.gas //string
            }
        );   
        } catch (에러) {
            res.redirect('/auth/logout')
        }
        
    })
})


router.post('/control/data-list', (req, res) => {
    req.app.db.collection('user-serial').find({ID : req.body.ID}).toArray(function(에러, 결과) {
        try {
            
        res.json(
            {
                serialList : 결과 
            }
        )
        } catch (에러) {
            res.redirect('/auth/logout')
        }
        
    })
})


//디폴트값은 아두이노에서 보내주고 디비에 저장해야함
router.post('/option-data', (req, res) => {
    req.app.db.collection('option').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
        try {
            res.json(
                {
                    temp : 결과.temp,
                    humid : 결과.humid,
                    dust : 결과.dust
                }
            );    
        } catch (에러) {
            res.redirect('/auth/logout')
        }
        
    })
})

router.put('/option-change', (req, res) => {
    req.app.db.collection('option').updateOne({serialNum : req.body.serialNum}, {$set : {temp : req.body.temp, humid : req.body.humid, dust : req.body.dust}}, (에러, 결과) => {
        res.json(true);
        if(에러) {
        res.json(false);
        }
    })
})

router.post('/log-data', (req, res) => {
    req.app.db.collection('log').find({serialNum : req.body.serialNum}).toArray(function(에러, 결과) {
        try {
            res.json(
                {
                    data : 결과
                }
            );    
        } catch (error) {
            res.redirect('/auth/logout');
        }
        
    })
})

//가스감지시 창문 state가 변하지 않는다면 계속 보내지 않음
router.delete('/log-delete', (req,res) => {
    var date = req.body.date + '+00:00'
    req.app.db.collection('log').deleteOne({serialNum : req.body.serialNum, Date : new Date(date)}, (에러, 결과) => {
        res.json(true);
    })
    
})

router.post('/mode', (req, res) => {
    req.app.db.collection('mode').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
        try {
         
        res.json(
            {
                automode : 결과.automode
            }
        );   
        } catch (에러) {
            res.redirect('/auth/logout')
        }
    })
})

//첫 설치시 아두이노에서 정보 쏴줘서 저장해야함
router.put('/mode-change', (req, res) => {
    req.app.db.collection('mode').updateOne({serialNum : req.body.serialNum}, {$set : {automode : req.body.automode}}, (에러, 결과) => {
        res.json(true);
    })
})

router.put('/state-change',(req,res)=>{
    req.app.db.collection('data-serial').updateOne({serialNum : req.body.serialNum}, {$set : {state : req.body.state}}, (에러, 결과) => {
        res.json(true);
    })
})

router.post('/add-window', (req, res) => {
    req.app.db.collection('serial').updateOne({serialNum : req.body.serialNum}, {$set : {registration : "Y"}}, (에러, 결과) => {
        if(에러) {
          res.json(false);
        }
      })
    
      req.app.db.collection('user-serial').insertOne({serialNum : req.body.serialNum, ID : req.body.ID, location : req.body.location}, (에러, 결과) => {
        if(에러) {
          res.json(false);
        }
      })
      res.json(true);
    })


module.exports = router;


