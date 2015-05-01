'use strict';
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// routers
var routes = require('./routes');
var register = require('./routes/register');
var login = require('./routes/login');
var entries = require('./routes/entries');

//customized middlewares
var messages = require('./lib/messages');
var validate = require('./lib/middleware/validate');
var user = require('./lib/middleware/user');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({ secret: '1234567890QWERTY' }));

//use our own middlewares
app.use('/api', api.auth);
app.use(messages);
app.use(user);

app.use(app.router); //router has to be placed after session in order for session to work

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', login.form);

app.get('/viewpost', page(Entry.count, 3), entries.list);
app.get('/post', entries.form);
//app.post('/post', entries.submit);
app.post('/post',
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 3),
  entries.submit);

//user registration
app.get('/register', register.form);
app.post('/register', register.submit);

//login logout
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

// api
app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
