require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require("passport");

require("./app_api/models/db");
require("./app_api/konfiguracija/passport");

var indexRouter = require('./app_server/routes/index');
var indexApi = require("./app_api/routes/index");
var usersRouter = require('./app_server/routes/users');


var app = express();

// BEGIN For changing JSON, maybe not useful anymore lol
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
});
// END For changing JSON


// view engine setup

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

require("./app_server/views/helpers/hbsh.js");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use("/api", indexApi);
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Obvladovanje napak zaradi avtentikacije
app.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError")
    res.status(401).json({ sporočilo: err.name + ": " + err.message + "." });
});

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
