const express = require('express')
const app = express();
const url = require('url');
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs')
require('dotenv').config();
const path = require('path');

const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);


var db; 

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, function(에러, client){  
    if(에러) return console.log(에러)

    db = client.db('smartwindow');

    app.db = db;
    
    http.listen(8080, function() {
        console.log('open server')
    });
});

const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { json } = require('body-parser');
const { send } = require('process');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'ID',
  passwordField: 'Password',
  session: true, 
  passReqToCallback: false, 
}, function (입력한아이디, 입력한비밀번호, done) {
  db.collection('user').findOne({ ID : 입력한아이디 }, function (에러, 결과) {
    if (에러) {
        return done(에러)
    }
    if (!결과) {
        return done(null, false, { message: '존재하지않는 아이디입니다.' })
    } 
    if (입력한비밀번호 == 결과.Password) { 
        return done(null, 결과) 
    } else {
        return done(null, false, { message: '비밀번호가 틀렸습니다.' })
    }
  })
}));

passport.serializeUser(function(user, done) {
    done(null, user.ID) 
});

passport.deserializeUser(function(아이디, done){ 
    db.collection('user').findOne({ID : 아이디}, function(에러, 결과) {
        done(null, 결과) 
    })
});


app.use(express.static(path.join(__dirname, 'build')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
})
    

app.use('/auth', require('./routes/auth.js'));

app.use('/main', require('./routes/main.js'));

app.use('/arduino', require('./routes/arduino.js'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'))
})
