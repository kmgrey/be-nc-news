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

exports.fetchArticles = () => {
	let sqlQuery = `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT(comments.comment_id)::int AS comment_count 
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC`;

	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
};

exports.fetchArticleById = (id) => {
	if (isNaN(id)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' });
	}
	let sqlQuery = `SELECT * FROM articles WHERE article_id = $1`;
	return db.query(sqlQuery, [id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not Found' });
		}
		return result.rows[0];
	});
};

exports.fetchCommentsByArticleId = (id) => {
	if (isNaN(id)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' });
	}
	let sqlQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
	return db.query(sqlQuery, [id]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not Found' });
		}
		return result.rows;
	});
};

exports.postCommentByArticleId = (username, body, id) => {
	if (isNaN(id)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' });
	}
	const queryParams = [body, username, id];
	const checkUsers = `SELECT * FROM users WHERE username = $1`;
	const checkId = `SELECT * FROM articles WHERE article_id = $1`;
	return db.query(checkUsers, [username]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not Found' });
		}
		return db.query(checkId, [id]).then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not Found' });
			}
			let sqlQuery = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`;
			return db.query(sqlQuery, queryParams).then(({ rows }) => {
				return rows[0];
			});
		});
	});
};

exports.updateArticleVotes = (votes, id) => {
	if (isNaN(id)) {
		return Promise.reject({ status: 400, msg: 'Bad Request' });
	}
	let sqlQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
	const queryParams = [votes, id];
	return db.query(sqlQuery, queryParams).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not Found' });
		}
		return result.rows[0];
	});
};

exports.removeCommentById = (id) => {
	return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [id]).then((result) => {
        if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not Found' });
		}
		return result.rows[0];
	});
};

exports.fetchUsers = () => {
    let sqlQuery = `SELECT * FROM users`;
	return db.query(sqlQuery).then(({ rows }) => {
		return rows;
	});
}
