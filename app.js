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
    app = express(),
    routes = require('./routes');

//var logger = require('./logger');
app.use(express.static(__dirname + '/public'));

app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('¡Algo no funciona!');
});

app.use(function(req, res, next) {
  res.status(404).send('¡Discúlpanos, no encontramos la página que solicitas!');
});

app.listen(3000, function(){
    console.log('listening on port 3000');
});
