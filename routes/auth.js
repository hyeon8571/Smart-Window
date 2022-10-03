const express = require('express');
const { read } = require('mongodb/lib/gridfs/grid_store');
var router = express.Router();
const passport = require('passport'); 

router.post('/register', (req, res) => {
  req.app.db.collection('user').insertOne({ID : req.body.ID, Password : req.body.Password}, (에러, 결과) => {
    if(에러) {
      res.json(false);
    }
  })

  req.app.db.collection('serial').updateOne({serialNum : req.body.serialNum}, {$set : {registration : "Y"}}, (에러, 결과) => {
    if(에러) {
      res.json(false);
    }
  })

  req.app.db.collection('user-serial').insertOne({serialNum : req.body.serialNum, ID : req.body.ID}, (에러, 결과) => {
    if(에러) {
      res.json(false);
    }
  })
  res.json(true);
})


router.post('/check-serial', (req, res) => {
  req.app.db.collection('serial').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
    if(결과 != null) {
      if(결과.registration == "N") {
        res.json(true);
      } else {
        res.json(false);
      }
    } else {
      res.json(false);
    }
  })
})


router.post('/check-id', (req, res) => {
  req.app.db.collection('user').findOne({ID : req.body.ID}, (에러, 결과) => {
    if(결과 != null) {
      res.json(false);
      console.log('사용불가능');
  } else {
      res.json(true);
      console.log('사용가능');
  }
  })
})

router.post('/login', passport.authenticate('local', {failureRedirect : '/auth/fail'}), (req, res) => {
  req.app.db.collection('user-serial').find({ID : req.body.ID}).toArray(function(에러, 결과) {
    console.log(결과);
    res.json(
      {
          pass : true,
          data : 결과  
      }
    );
    if(에러) {
      res.json({pass : false});
    }
  })
});

router.get('/fail', (req, res) => {
  res.redirect('/login');
})


router.post('/find-id', (req, res) => {
  req.app.db.collection('user-serial').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
    if(결과 != null) {
      res.json(결과.ID);
    } else {
      res.json(false);
    }
  })
})

router.post('/find-password', (req, res) => {
  req.app.db.collection('user-serial').findOne({serialNum : req.body.serialNum}, (에러, 결과) => {
    if(결과 != null) {
      if(req.body.ID != 결과.ID) {
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

