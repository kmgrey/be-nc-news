const { fetchApi, fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, postCommentByArticleId } = require('../models/api.models');

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

exports.postArticleComment = (request, response, next) => {
	const { article_id } = request.params;
	const {username, body} = request.body;
	if (!username || !body) {
		response.status(400).send({ msg: 'Bad Request' });
	}
	postCommentByArticleId(username, body, article_id)
		.then((comment) => {
			response.status(201).send({ comment });
		})
		.catch(next);
};
