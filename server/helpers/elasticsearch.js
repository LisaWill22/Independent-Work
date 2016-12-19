const esHelper = function(esClient) {

    // Creates a user to index
	createUserIndex = function(user) {
		esClient.index({
			index: 'users',
			type: 'user',
			id: user._id,
			body: user
		}, function(error, response) {
			if (error) {
				console.log(error);
			}
            console.log('success');
			console.log(response);
		});
	}
};

module.exports = esHelper;
