const express = require('express');
const app = express();
const { getApi, getTopics, getArticles, getArticleById, getArticleComments, postArticleComment, patchArticleById, deleteCommentById, getUsers } = require('./controllers/api.controllers');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);

app.post('/api/articles/:article_id/comments', postArticleComment);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.all('*', (request, response) => {
	response.status(404).send({ msg: 'Not Found' });
});

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else response.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
