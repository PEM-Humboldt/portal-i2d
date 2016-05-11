# Portal de la Infraestructura Institucional de Datos del IAvH 

## Usage: 

Access to main page for performing searches:

* http://localhost:3000/

The web service paths are these: 

* http://localhost:3000/geoSearch               Full text search in GeoNetwork
* http://localhost:3000/geoMetadata             Get metadata by id from GeoNetwork
* http://localhost:3000/bioSearch               Full text search in Ceiba (ES)

### GET request examples: 

* http://localhost:3000/geoSearch?q=antioquia&f=1&s=5
* http://localhost:3000/geoMetadata?id=420
* http://localhost:3000/bioSearch?q=aves&f=0&s=5

### Tests:  

After running the web service, type in another console: 

   node test/tests.js
   
in order to start the tests. 
