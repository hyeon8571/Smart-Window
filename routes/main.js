const express = require('express');
var router = express.Router();




router.post('/control/data', (req, res) => {
    req.app.db.collection('data-serial').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
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
        
    })
})

//디폴트값은 아두이노에서 보내주고 디비에 저장해야함
router.post('/option-data', (req, res) => {
    req.app.db.collection('option').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
        console.log(결과);
        res.json(
            {
                temp : 결과.temp,
                humid : 결과.humid,
                dust : 결과.dust
            }
        );
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


//가스감지시 창문 state기 변하지 않는다면 계속 보내지 않음
router.delete('/log-delete', (req,res) => {
    
})


module.exports = router;


