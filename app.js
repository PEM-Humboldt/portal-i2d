/* 
   Portal web de la Infraestructura Institucional de Datos del IAvH
   Copyright (C) 2016 Germán Carrillo para el IAvH
   E-mail:   gcarrillo@linuxmail.org 

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program. If not, see <http://www.gnu.org/licenses>
*/

var express = require('express'),
    helmet = require('helmet'),
    app = express(),
    serviceRoutes = require('./routes/service');
    //logger = require('./logger');
       
// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use Helmet to cover some security issues via HTTP headers
app.use(helmet());  

app.use(express.static(__dirname + '/public'));

// Enable CORS 
app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', serviceRoutes);

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(500).render('5xx', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(500).render('5xx', {
        message: err.message,
        error: null
    });
});

// Catch anything else
app.use(function(req, res, next) {
  res.status(404).render('404', { url: req.originalUrl });
});

module.exports = app;
