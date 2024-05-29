const express = require('express');
const app = express();
const { getApi, getTopics, getArticles, getArticleById, getArticleComments, postArticleComment } = require('./controllers/api.controllers');
app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);

app.post('/api/articles/:article_id/comments', postArticleComment);

app.use((request, response, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else if (error.status === 404) {
		response.status(404).send({ msg: 'Not Found' });
	} else response.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
