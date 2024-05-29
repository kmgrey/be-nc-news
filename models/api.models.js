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

let validArticleIds = [];

exports.getValidArticleIds = () => {
	let sqlQuery = `SELECT * FROM articles`;
	return db.query(sqlQuery).then((result) => {
        const articleArr = result.rows
        articleArr.forEach((article) => {
            validArticleIds.push(article.article_id)
        })
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
