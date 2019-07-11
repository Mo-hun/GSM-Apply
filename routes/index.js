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
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('index', { mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url });
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
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('info_school', { mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url });
});

router.get('/notice', (req, res, next)=>{
  var stwice = req.session;
  var admin = false;
  if(stwice.user_id){
    if(stwice.user_code == 20151020){
      admin = true;
    }
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  var status;
  var selectsql = "SELECT * FROM `notice_info` ORDER BY notice_idx DESC";
    db.query(selectsql, function (error, results) {
      if (error) {
        status = "err";
        console.log("err");
      }
      else  {
        if(!results[0]){
          status = "no";
          console.log("no");
        }else{
          status = "yes";
          console.log(results);
        }
      }
      var obj = { admin: admin, mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url , admin : admin, status : status, notice : results};
      console.log(obj)
      res.render('notice',obj);
    });
    
});

router.get('/mypage', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = 'mypage';
  }else{
    var mode = 'exit';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('mypage', { mode : mode, id : req.session.user_id, name : req.session.user_name, email : req.session.user_email, birth : req.session.user_birth});
});

router.get('/info_apply', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('info_apply', { mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url });
});

router.get('/apply', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  console.log(stwice);
  console.log(req.session.user_id);
  res.render('apply', { mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url });
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

router.get('/simul', (req, res, next)=>{
  res.render('disable');
});

router.get('/apply_score', (req, res, next)=>{
  res.render('disable');
});

router.get('/cs_main', (req, res, next)=>{
  res.render('disable');
});

router.get('/notice_write', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  if(req.session.user_code != 20151020){
    res.render('permission');
  }else{
    res.render('notice_write', { mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url });
  }
});

router.post('/notice_write_proc', (req, res, next)=>{
  if(req.session.user_code != 20151020){
    res.render('permission');
  }else{
    var title = req.body.title;
    var body = req.body.body;
    var name = req.session.user_name;
    var selectsql = "INSERT INTO `notice_info`(notice_title, notice_body, notice_date, notice_author) VALUES (?,?,NOW(), ?)";
    db.query(selectsql,[title, body, name], function (error, results) {
      res.redirect('/');
    });
  }
});

router.get('/notice_view', (req, res, next)=>{
  var stwice = req.session;
  if(stwice.user_id){
    var mode = '로그아웃 (LOGOUT)';
    var mode_url = 'logout';
    var mode2 = '마이페이지 (MYPAGE)';
    var mode2_url = 'mypage';
  }else{
    var mode = '로그인 (LOGIN)';
    var mode_url = 'login';
    var mode2 = '회원가입 (SIGN UP)';
    var mode2_url = 'signup_agree';
  }
  var notice_no = req.query.notice_id;
  var selectsql = "SELECT * FROM notice_info WHERE notice_idx = ?";
  db.query(selectsql,[notice_no], function (error, results) {
    res.render('notice_view', {notice : results, mode: mode , mode_url : mode_url, mode2 : mode2, mode2_url : mode2_url });
  });
});

router.post('/mypage_proc', (req, res, next)=>{
  console.log("up");
  if(!req.session.user_id){
    res.render('islogin',null,function(){
    });
  }else{
    var id = req.session.user_id;
    var pw = req.body.pw;
    var npwc = 0;
    if(req.body.new_pw){
      npwc = 1;
      var npw = req.body.new_pw;
      var nhash = crypto.createHash('sha512').update(npw).digest('base64');
    }
    var hash = crypto.createHash('sha512').update(pw).digest('base64');
   
    var selectsql = "SELECT * FROM `user_info` WHERE `user_id` = ?";
    db.query(selectsql,[id], function (error, results) {
      if (error) {
        res.render('mypage_message',{status : "err"});
      }
      else  {
        console.log("up");
        if(!results[0]){
          res.render('mypage_message',{status : "chidpw"});
        }else{
          if(results[0].user_pw == hash){
            if(npwc == 1){
              db.query(`UPDATE user_info SET user_name = ?, user_birth = ?, user_pw = ?, user_email  = ? WHERE user_idx = ?`,
              [req.body.name, req.body.birth, nhash, req.body.email, req.session.user_idx], function (error, results, fields) {
                console.log("up");
                if (error) {
                  res.render('mypage_message',{status : "err"});
                }
                else  {
                  req.session.user_birth = req.body.birth;
                  req.session.user_name = req.body.name;
                  req.session.user_email = req.body.email;
                  res.render('mypage_message',{status : "success"});
                }
              });
            }else{
              db.query(`UPDATE user_info SET user_name = ?, user_birth = ?, user_email = ? WHERE user_idx = ?`,
              [req.body.name, req.body.birth, req.body.email, req.session.user_idx], function (error, results, fields) {
                console.log("up");
                if (error) {
                  res.render('mypage_message',{status : "err"});
                }
                else  {
                  req.session.user_birth = req.body.birth;
                  req.session.user_name = req.body.name;
                  req.session.user_email = req.body.email;
                  res.render('mypage_message',{status : "success"});
                }
              });
            }
          }else{
            res.render('mypage_message',{status : "chidpw"});
          }
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
          req.session.user_idx = results[0].user_idx;
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
