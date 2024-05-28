const express = require('express');
const app = express();
const { getApi, getTopics, getArticleById } = require('./controllers/api.controllers');

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else next(error);
});

module.exports = app;
