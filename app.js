const express = require('express');
const app = express();
const { getApi, getTopics } = require('./controllers/api.controllers');

app.get('/api', getApi)

app.get('/api/topics', getTopics);

app.use((error, request, response, next) => {
	if (error.status && error.msg) {
		response.status(error.status).send({ msg: error.msg });
	} else next(error);
});

module.exports = app;
