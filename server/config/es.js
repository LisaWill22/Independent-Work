// Set up elastic search
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
	host: process.env.SEARCHBOX_SSL_URL,
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
