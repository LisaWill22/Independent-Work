// Set up elastic search
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
	//TODO REPLACE
	// host: process.env.SEARCHBOX_SSL_URL,
	host: "https://paas:8c733a71d679fa9b28f1f0ca26824c80@dori-us-east-1.searchly.com",
	log: 'trace'
});

// Ping es to see if its working
esClient.ping({
	requestTimeout: 30000,
}, function(error) {
	if (error) {
		console.error('elasticsearch cluster is down!');
	} else {
		console.log('All is well');
	}
});


module.exports = esClient;
