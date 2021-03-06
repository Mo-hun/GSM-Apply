var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
var dbconfig = require('./config/dbconfig');
var db = mysql.createConnection(dbconfig);
const https = require('https');
const fs = require('fs');


db.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(request, response){
  if(!request.secure){
    response.redirect("https://" + request.headers.host + request.url);
  }
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended : false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

app.use(session({
  secret: 'twicelandoooooo',
  store: new MySQLStore(dbconfig),
  resave: true,
  saveUninitialized: true
}));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/path/to/key.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/path/to/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/path/to/chain.pem')
}, app).listen(443, () => {
  console.log('Listening...')
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
