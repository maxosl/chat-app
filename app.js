'use strict';

// Chat application dependencies
const express = require('express');
const path = require('path');

const routes = require(path.join(__dirname, 'routes'));
const app = express();

// call socket.io to the app
app.io = require('socket.io')();
require(path.join(__dirname, 'backend/socket-events-handler/eventsHandler'))(app.io);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Only serve static content on prod
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
