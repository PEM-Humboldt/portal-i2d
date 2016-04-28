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
    //bodyParser = require('body-parser'),
    //jsonParser = bodyParser.json(),
    geoCatalogController = require('./controllers/geo_catalog_controller'),
    bioCatalogController = require('./controllers/bio_catalog_controller'),
    router = express.Router();

router.get( '/geoSearch', geoCatalogController.search ); 
router.get( '/geoMetadata', geoCatalogController.getMetadata ); 
router.get( '/bioSearch', bioCatalogController.search ); 

module.exports = router;

