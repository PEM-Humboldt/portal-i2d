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

var express = require('express');
var logger = require('../util/logger');
var geoCatalogController = require('../controllers/service/geo_catalog_controller');
var bioCatalogController = require('../controllers/service/bio_catalog_controller');

var router = express.Router();
router.use(function (req, res, next) {
  if (['/geoSearch/', '/geoMetadata/', '/bioSearch/'].findIndex(e => req.path == e) !== -1) {
    const param = req.query;
    logger.info(`New request to ${req.path} with params: ${Object.keys(param)
      .map(e => `${e}: ${param[e]}`)
      .join(', ')}`
    );
  }
  next();
});

router.get( '/geoSearch', geoCatalogController.search );
router.get( '/geoMetadata', geoCatalogController.getMetadata );
router.get( '/bioSearch', bioCatalogController.search );

module.exports = router;

