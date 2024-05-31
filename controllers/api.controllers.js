const { fetchApi, fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, postCommentByArticleId, updateArticleVotes, removeCommentById, fetchUsers } = require('../models/api.models');

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

exports.getUsers = (request, response, next) => {
	fetchUsers()
		.then((users) => {
			response.status(200).send({ users });
		})
		.catch(next);
};

exports.getArticles = (request, response, next) => {
	const { author, topic, sort_by, order } = request.query;
	fetchArticles(author, topic, sort_by, order)
		.then((articles) => {
            if (articles.length === 0){
                response.status(404).send({ msg: 'Not Found' });
            }
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
	const { username, body } = request.body;
	if (!username || !body) {
		response.status(400).send({ msg: 'Bad Request' });
	}
	postCommentByArticleId(username, body, article_id)
		.then((comment) => {
			response.status(201).send({ comment });
		})
		.catch(next);
};

exports.patchArticleById = (request, response, next) => {
	const { article_id } = request.params;
	const { inc_votes } = request.body;
	if (typeof inc_votes !== 'number') {
		response.status(400).send({ msg: 'Bad Request' });
	}
	updateArticleVotes(inc_votes, article_id)
		.then((article) => {
			response.status(200).send({ article });
		})
		.catch(next);
};

exports.deleteCommentById = (request, response, next) => {
	const { comment_id } = request.params;
	if (isNaN(comment_id)) {
		response.status(400).send({ msg: 'Bad Request' });
	}
	removeCommentById(comment_id)
		.then((comment) => {
			response.status(204).send();
		})
		.catch(next);
};
