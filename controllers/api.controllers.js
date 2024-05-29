const { fetchApi, fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId } = require('../models/api.models');

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

exports.getArticles = (request, response, next) => {
	fetchArticles()
		.then((articles) => {
			response.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (request, response, next) => {
	const { article_id } = request.params;
	fetchArticleById(article_id)
		.then((article) => {
			response.status(200).send({ article });
		})
		.catch(next);
};

exports.getArticleComments = (request, response, next) => {
	const { article_id } = request.params;
	fetchCommentsByArticleId(article_id)
		.then((comments) => {
			response.status(200).send({ comments });
		})
		.catch(next);
};
