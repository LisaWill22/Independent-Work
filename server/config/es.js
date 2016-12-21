// Set up elastic search
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
	host: process.env.SEARCHBOX_SSL_URL,
	log: 'trace'
});

module.exports = client;
