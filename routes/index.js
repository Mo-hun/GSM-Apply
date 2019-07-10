var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const session = require('express-session');
var crypto = require('crypto');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../config/dbconfig');
var db = mysql.createConnection(dbconfig);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


db.connect((err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("success");
  }
});

router.get('/', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('index', { mode: mode , mode_url : mode_url });
});

router.get('/login', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var islogin = true;
  }else{
    var islogin = false;
  }
  console.log(stwice.user_id);
  res.render('login', { islogin: islogin });
});


router.get('/signup', (req, res, next)=>{
  if(req.session.user_id){
    var islogin = true;
  }else{
    var islogin = false;
  }
  console.log(req.session.user_id);
  res.render('signup', { islogin: islogin });
});

router.get('/signup_agree', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var islogin = true;
  }else{
    var islogin = false;
  }
  console.log(stwice.user_id);
  res.render('signup_agree', { islogin: islogin });
});

router.get('/info_school', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('info_school', { mode: mode , mode_url : mode_url });
});

router.get('/info_apply', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('info_apply', { mode: mode , mode_url : mode_url });
});

router.get('/apply', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('apply', { mode: mode , mode_url : mode_url });
});

router.get('/logout', (req, res, next)=>{
  req.session.destroy(function(err){
    if(err){
      console.log(err);
      res.render('logout',{status : "err"});
    }else{
      res.render('logout',{status : "success"});
    }
    
  });
});

router.post('/signup_proc', (req, res, next)=>{
  if(req.session.user_id){
    res.render('islogin',null,function(){

    });
  }else{
    var id = req.body.id;
    var pw = req.body.pw;
    var hash = crypto.createHash('sha512').update(pw).digest('base64');
    var selectsql = "SELECT * FROM `user_info` WHERE `user_id` = ?";
    db.query(selectsql,[id], function (error, results) {
      if (error) {
        res.render('signup_message',{status : "err"});
      }
      else  {
        if(results[0]){
          res.render('signup_message',{status : "chidpw"});
        }else{
          db.query(`INSERT INTO user_info ( user_name, user_birth, user_id, user_pw, user_email) VALUES (?, ?, ?, ?, ?)`,
          [req.body.name, req.body.birth, id, hash, req.body.email], function (error, results, fields) {
            if (error) {
              res.render('signup_message',{status : "err"});
            }
            else  {
              res.render('signup_message',{status : "success"});
            }
          });
        }
      }
    });
  }
});

router.post('/login_proc', (req, res, next)=>{
  if(req.session.user_id){
    res.render('islogin',null,function(){
      
    });
  }else{
    var id = req.body.id;
    var hash = crypto.createHash('sha512').update(req.body.pw).digest('base64');
    console.log(hash);
    var selectsql = "SELECT * FROM `user_info` WHERE `user_id` = ?";
    db.query(selectsql,[id], function (error, results) {
      if(error)
              console.log(error);
      console.log(results);
      console.log(results[0]);
      if(!results[0]){
        res.render('login_message',{status : "chidpw"});
      }
      else  {
        if(results[0].user_pw == hash){
          req.session.user_id = req.body.id;
          req.session.user_birth = results[0].user_birth;
          req.session.user_email = results[0].user_email;
          req.session.user_name = results[0].user_name;
          req.session.user_code = results[0].user_code;
          req.session.save(()=>{
            console.log('hello');
            res.render('login_message',{status : "success"});
          });
        }else{
            res.render('login_message',{status : "chidpw"});
        }
      }
    }); 
  }
});

router.post('/idcheck', (req, res, next)=>{
  if(req.session.user_id){
    res.render('islogin',null,function(){
      
    });
  }else{
    var id = req.body.id;
    console.log(id);
    var selectsql = "SELECT * FROM `user_info` WHERE `user_id` = ?";
    db.query(selectsql,[id], function (error, results) {
      var ress = true;
      if(error)
              console.log(error);

      if(results[0]){
        ress = false;
      }
      else  {
        ress = true;
      }
      console.log(ress);
      res.send({result : ress, code : 1});
    }); 
  }
  
});

module.exports = router;
