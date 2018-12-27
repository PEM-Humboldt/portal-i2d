# Portal de la Infraestructura Institucional de Datos del IAvH

## Requirements

* NodeJs v10.14.2
* Docker v18.06.1

## Run

run `npm start` to run the app in development mode

## Deploy

### Build image
Build the image with `docker build -t portal-i2d:0.7.0 .`

### Run the container
Run a new container with `docker run --restart always --name portal-i2d -p 3000:3000 -d portal-i2d:0.7.0`

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
