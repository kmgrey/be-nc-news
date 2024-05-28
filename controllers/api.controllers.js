const { fetchApi, fetchTopics } = require('../models/api.models');

exports.getApi = (request, response, next) => {
	fetchApi()
		.then((endpoints) => {
			response.status(200).send({ endpoints });
		})
		.catch(next);
};

exports.getTopics = (request, response, next) => {
	fetchTopics()
		.then((topics) => {
			response.status(200).send({ topics });
		})
		.catch(next);
};
