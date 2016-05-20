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

var httpRequest = require('request'),
    config = require('../../config'),
    libxmljs = require('libxmljs'),
    searchUrl = config.geoSearchUrl, 
    metadataUrl = config.geoMetadataUrl;

exports.search = function(request, response) {
  var q = request.query.q,
      f = request.query.f || 1,
      s = request.query.s || config.geoResultSize;

  if (q === undefined){
    response.status(500).send({statusCode:500, message: 'Parameter q is missing.'});
    return;
  }

  console.log(" ***** POST GEO (q: " + q + ") ***** ");
  var xmlData = '<?xml version="1.0" encoding="UTF-8"?> \
    <request> \
      <any>' + q + '</any> \
      <from>' + f + '</from> \
      <to>' + (+f + +s-1) + '</to> \
      <fast>index</fast> \
    </request>';
  httpRequest({
    uri: searchUrl,
    method: "POST",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 2,
    headers: {
        "content-type": "application/xml",  // <-- Important!!!
    },
    body: xmlData
  }, function(error, res, body) {
    if (error){
      response.status(500).send({statusCode:500, message: "An error occurred during the HTTP request. "+error});
    } else {
      if (res.statusCode == 404){
        response.status(404).send({statusCode:404, message: "The service is down, although the server responded. " + error});
      } else if (res.statusCode == 400){  
        response.status(400).send({statusCode:400, message: "There was a problem with the request. The server could not respond properly."});      
      } else {
        // Validate proper response
        if(res.headers['content-type'].indexOf('xml') != -1){

          var xmlDoc = libxmljs.parseXml( res.body ), 
              idNodeArray = []
              idArray = [],
              totalCount = 0,
              retrievedCount = 0;
              
          if ( xmlDoc.root().name() == 'response' ){ // Root from GN response is called 'response'
            totalCount = xmlDoc.get('//summary').attr('count').value();
            idNodeArray = xmlDoc.find('//id');
            for ( var i=0, len=idNodeArray.length; i<len; i++){
              idArray.push( idNodeArray[i].text() );
            }
            retrievedCount = idArray.length;
            response.status(200).send({query:q, metadataIds:idArray, retrieved:retrievedCount, total:totalCount});
          } else {
            response.status(400).send({statusCode:400, message: 'The response from the server does not correspond to a proper GN response.'});
          }
          
        } else {
          response.status(400).send({statusCode:400, message: 'The service did not send a proper XML response.'});
        }
      }
    }
  });
};

exports.getMetadata = function(request, response) {
  var id = request.query.id;

  if (id === undefined){
    response.status(500).send({statusCode:500, message: 'Parameter id is missing.'});
    return;
  }

  console.log(" ***** POST (id: " + id + ") ***** ");
  var xmlData = '<?xml version="1.0" encoding="UTF-8"?> \
    <request> \
      <id>' + id + '</id> \
    </request>';
  httpRequest({
    uri: metadataUrl,
    method: "POST",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 2,
    headers: {
        "content-type": "application/xml",  // <-- Important!!!
    },
    body: xmlData
  }, function(error, res, body) {
    if (error){
      response.status(500).send({statusCode:500, message: "An error occurred during the HTTP request. "+error});
    } else {
      if (res.statusCode == 404){
        response.status(404).send({statusCode:404, message: "The service is down, although the server responded. " + error});
      } else if (res.statusCode == 400){  
        response.status(400).send({statusCode:400, message: "There was a problem with the request. The server could not respond properly."});      
      } else {
        // Validate proper response
        // UUID, Título, Título Alternativo, Abstract, Graphic
        if(res.headers['content-type'].indexOf('xml') != -1){

          var xmlDoc = libxmljs.parseXml( res.body );
          if ( xmlDoc.root().name() == 'MD_Metadata' ){ // Root from GN response is called 'gmd:MD_Metadata'
            var uuid = xmlDoc.get('//gmd:fileIdentifier/gco:CharacterString', 
                { gmd: 'http://www.isotc211.org/2005/gmd', gco: 'http://www.isotc211.org/2005/gco' }),
              title = xmlDoc.get('//gmd:title/gco:CharacterString', 
                { gmd: 'http://www.isotc211.org/2005/gmd', gco: 'http://www.isotc211.org/2005/gco' }),
              alternateTitle = xmlDoc.get('//gmd:alternateTitle/gco:CharacterString', 
                { gmd: 'http://www.isotc211.org/2005/gmd', gco: 'http://www.isotc211.org/2005/gco' }),
              abstract = xmlDoc.get('//gmd:abstract/gco:CharacterString', 
                { gmd: 'http://www.isotc211.org/2005/gmd', gco: 'http://www.isotc211.org/2005/gco' }),
              graphicUrl = xmlDoc.get('//gmd:MD_BrowseGraphic/gmd:fileName/gco:CharacterString', 
                { gmd: 'http://www.isotc211.org/2005/gmd', gco: 'http://www.isotc211.org/2005/gco' });
            response.status(200).send({ id:id, 
              uuid: uuid !== undefined ? uuid.text() : null, 
              title: title !== undefined ? title.text() : null, 
              alternateTitle: alternateTitle !== undefined ? alternateTitle.text() : null, 
              abstract: abstract !== undefined ? abstract.text() : null, 
              graphicUrl: graphicUrl !== undefined ? graphicUrl.text() : null
            });
          } else {
            response.status(400).send({statusCode:400, message: 'The response from the server does not correspond to a proper GN response.'});
          }
          
        } else {
          response.status(400).send({statusCode:400, message: 'The service did not send a proper XML response.'});
        }
      }
    }
  });
};
