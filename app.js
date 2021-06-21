var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
var logger = require('morgan');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',exphbs({extname: 'hbs', defaultLayout: 'layout', handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: __dirname + '/views/'}))
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

mongoose.connect('mongodb+srv://Sadiq:sadiq953@cluster0.xbl4e.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log('connected to mongodb'))
.catch(err => console.error('could not connect to mongoDB...',err));

module.exports = app;
