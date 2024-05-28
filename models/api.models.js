const db = require('../db/connection');
const format = require('pg-format');

exports.fetchTopics = () => {
	let sqlQuery = `SELECT * FROM topics`;
    
	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
};
