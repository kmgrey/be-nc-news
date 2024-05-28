const db = require('../db/connection');
const fs = require('fs/promises');
const format = require('pg-format');

exports.fetchApi = () => {
	return fs.readFile('./endpoints.json', 'utf-8').then((result) => {
		return JSON.parse(result);
	});
};

exports.fetchTopics = () => {
	let sqlQuery = `SELECT * FROM topics`;
	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
};

let validArticleIds = [];

exports.getValidArticleIds = () => {
	let sqlQuery = `SELECT * FROM articles`;
	return db.query(sqlQuery).then((result) => {
		validArticleIds.push(result);
	});
};

exports.fetchArticleById = (id) => {
	if (id > validArticleIds.length || isNaN(id)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' });
	}
	let sqlQuery = `SELECT * FROM articles WHERE article_id = $1`;
	return db.query(sqlQuery, [id]).then((result) => {
		return result.rows[0];
	});
};
