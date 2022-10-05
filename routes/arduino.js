const express = require('express');
var router = express.Router();


router.get('/register', (req, res) => {
    req.app.db.collection('serial').findOne({serialNum : req.query.serialNum}, (에러, 결과) => {  //꺼졌다 켜졌을때 대비
        if(결과 == null) {
            req.app.db.collection('serial').insertOne({serialNum : req.query.serialNum, registration : "N"}, (에러, 결과) => {      
                if(에러) {
                    res.json({check : "false"});
                } else {
                    res.json({check : "true"});
                } 
        })
    }else {
        res.json({check : "true"});
    }
})
})


module.exports = router;