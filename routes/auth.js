const express = require('express');
const { read } = require('mongodb/lib/gridfs/grid_store');
var router = express.Router();
const passport = require('passport'); 


const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../fcmtest-3a188-firebase-adminsdk-x385i-f6546d024e.json')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
})

// 회원가입
router.post('/register', (req, res) => {
  req.app.db.collection('user').insertOne({ID : req.body.ID, Password : req.body.Password, Token : "null"}, (err, result) => {
    if(err) {
      res.json(false);
    }
  })

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


// 시리얼 번호 검사
router.post('/check-serial', (req, res) => {
  req.app.db.collection('serial').findOne({serialNum : req.body.serialNum}, (err, result) => {
    if(result != null) {
      if(result.registration == "N") {
        res.json(true);
      } else {
        res.json(false);
      }
    } else {
      res.json(false);
    }
  })
})


// 아이디 사용가능 여부 검사
router.post('/check-id', (req, res) => {
  req.app.db.collection('user').findOne({ID : req.body.ID}, (err, result) => {
    if(result != null) {
      res.json(false);
      console.log('사용불가능');
  } else {
      res.json(true);
      console.log('사용가능');
  }
  })
})

// 로그인 기능
router.post('/login', passport.authenticate('local', {failureRedirect : '/auth/fail'}), (req, res) => {
  req.app.db.collection('user-serial').find({ID : req.body.ID}).toArray(function(err, result) {
    res.json(
      {
          pass : true,
          data : result  
      }
    );
    if(err) {
      res.json({pass : false});
    }
  })
});

let fcmToken = '';

router.post('/get-token', (req, res) => {
  req.app.db.collection('user').updateOne({ID : req.body.ID}, {$set : {Token : req.body.token}}, (err, result) => {
    fcmToken = req.body.token;
  })
})


setInterval(() => {
  console.log(fcmToken);
  if(fcmToken != '') {
    var message = {
      notification:{
          title: '가스',
          body:"doit"
      }
      ,token:fcmToken
    }
    firebaseAdmin.messaging().send(message)
    .then((response)=>{
      console.log('메시지 전송 성공 : ',response)
    })
    .catch((e)=>{
      console.error('message error : ',e)
    })
  }
    
}, 10000);


router.get('/fail', (req, res) => {
  res.redirect('/login');
})

// 아이디 찾기 기능
router.post('/find-id', (req, res) => {
  req.app.db.collection('user-serial').findOne({serialNum : req.body.serialNum}, (err, result) => {
    if(result != null) {
      res.json(result.ID);
    } else {
      res.json(false);
    }
  })
})

// 비밀번호 찾기 기능
router.post('/find-password', (req, res) => {
  req.app.db.collection('user-serial').findOne({serialNum : req.body.serialNum}, (err, result) => {
    if(result != null) {
      if(req.body.ID != result.ID) {
        res.json({err : "IDerr"});
      } else {
        req.app.db.collection('user').findOne({ID : req.body.ID}, (err, result) => {
          res.json(result.Password);
        })
      } 
    } else {
      res.json({err : "serialerr"});
    }
  })
})


// 로그아웃 기능
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if(err) {
      return next(err); 
    }
    req.session.destroy(() => {
      res.cookie('connect.sid', '',{maxAge:0});
      res.redirect('/')
    })
  })
})



module.exports = router;