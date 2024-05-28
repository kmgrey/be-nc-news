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
