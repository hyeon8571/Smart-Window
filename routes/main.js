const express = require('express');
var router = express.Router();




router.post('/control/data', (req, res) => {
    req.app.db.collection('data-serial').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
        
        res.json(
            {
                temp : 결과.temperature,
                humid : 결과.humidity,
                dust : 결과.dust,
                state : 결과.state,
                rain : 결과.rain,
                gas : 결과.gas
            }
        );
        
    })
})


router.put('/option-change', (req, res) => {
    req.app.db.collection('option').updateOne({ID : req.body.serialNum}, {$set : {temperature : req.body.temp, humidity : req.body.humid, dust : req.body.dust}}, (에러, 결과) => {
        res.json(true);
        if(애러) {
            res.json(false);
        }
    })
})


router.delete('/log-delete', (req,res) => {
    
})


module.exports = router;


