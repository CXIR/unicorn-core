var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var media = require('./routes/media');
var messaging = require('./routes/messaging');
var passenger_request = require('./routes/passenger_request');
var report = require('./routes/report');
var ride = require('./routes/ride');
var site = require('./routes/site');
var status = require('./routes/status');
var users = require('./routes/users');
var vehicle = require('./routes/vehicle');

var models = require('./models');
models.sequelize.sync();

//models.sequelize.sync({force:true});

/*models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true}).then(function(results) {
        models.sequelize.sync({force: true});
});*/


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/', index);
app.use('/media', media);
app.use('/messaging', messaging);
app.use('/passenger_request', passenger_request);
app.use('/report', report);
app.use('/ride', ride);
app.use('/site', site);
app.use('/status', status);
app.use('/users', users);
app.use('/vehicle', vehicle);

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
