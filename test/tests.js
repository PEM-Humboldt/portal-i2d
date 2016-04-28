var testing = require('testing'),
    httpRequest = require('request');

var domain = 'localhost:3000';

/************************************ G E T ***********************************/
function testGeoSearchQueryIsMandatory( callback ) {
    console.log("Starting testGeoSearchQueryIsMandatory...");
    httpRequest({
        uri: "http://" + domain + "/geoSearch?a=b",
        method: "GET",
        timeout: 5000,
        followRedirect: true,
        maxRedirects: 2
    }, function(error, res, body) {
        if (error){
            testing.failure('Error in the GET request. ' + error, callback);
        } else {
            if ( typeof(body)==="string" ) {
                body = JSON.parse(body);
            }
            testing.assert(body.message !== undefined && body.message === "Parameter q is missing.", "Parameter q should be identified as missing.", callback);
            testing.success(callback);
        }
    });
}

function testGeoMetadataIdIsMandatory( callback ) {
    console.log("Starting testGeoMetadataIdIsMandatory...");
    httpRequest({
        uri: "http://" + domain + "/geoMetadata?a=b",
        method: "GET",
        timeout: 5000,
        followRedirect: true,
        maxRedirects: 2
    }, function(error, res, body) {
        if (error){
            testing.failure('Error in the GET request. ' + error, callback);
        } else {
            if ( typeof(body)==="string" ) {
                body = JSON.parse(body);
            }
            testing.assert(body.message !== undefined && body.message === "Parameter id is missing.", "Parameter id should be identified as missing.", callback);
            testing.success(callback);
        }
    });
}

function testBioSearchQueryIsMandatory( callback ) {
    console.log("Starting testBioSearchQueryIsMandatory...");
    httpRequest({
        uri: "http://" + domain + "/bioSearch?a=b",
        method: "GET",
        timeout: 5000,
        followRedirect: true,
        maxRedirects: 2
    }, function(error, res, body) {
        if (error){
            testing.failure('Error in the GET request. ' + error, callback);
        } else {
            if ( typeof(body)==="string" ) {
                body = JSON.parse(body);
            }
            testing.assert(body.message !== undefined && body.message === "Parameter q is missing.", "Parameter q should be identified as missing.", callback);
            testing.success(callback);
        }
    });
}

/**
 * Run package tests.
 */
var test = function(callback){
    var tests = [
        testGeoSearchQueryIsMandatory,
        testGeoMetadataIdIsMandatory,
        testBioSearchQueryIsMandatory                
    ];
    testing.run(tests, callback);
};

test(testing.show);
