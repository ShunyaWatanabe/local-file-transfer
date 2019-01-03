const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const path = require('path');
const port = 3000;
const busboy = require('connect-busboy'); //middleware for form/file upload
const zip = require('express-zip');
const indexRouter = require('./routes/index');

// use files in /views directory as static files
app.use(express.static(__dirname + '/views'));

// use files in /public directory as static files
app.use(express.static(__dirname + '/public'));

app.use(busboy());

// use bodyParser to enable POST
app.use(bodyParser.urlencoded({
   extended: false
}));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

module.exports = app;