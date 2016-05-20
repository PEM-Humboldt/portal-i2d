var config = {};

config.port = 3000;
config.bioSearchUrl = 'http://localhost:9200/';
config.geoSearchUrl = 'http://geonetwork.humboldt.org.co/geonetwork/srv/eng/xml.search';
config.geoMetadataUrl = 'http://geonetwork.humboldt.org.co/geonetwork/srv/eng/xml.metadata.get';
config.bioResultSize = 5;
config.geoResultSize = 5;

module.exports = config;
