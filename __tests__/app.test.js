const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const request = require('supertest');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api', () => {
	test('200: responds with an object describing all available api endpoints', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				const { endpoints } = body;
				expect(endpoints).toHaveProperty('GET /api');
				expect(endpoints).toHaveProperty('GET /api/topics');
				expect(endpoints).toHaveProperty('GET /api/articles');
				Object.keys(endpoints).forEach((key) => {
					const endpoint = endpoints[key];
					expect(endpoint).toMatchObject({
						description: expect.any(String),
						queries: expect.any(Array),
						exampleResponse: expect.any(Object),
					});
				});
			});
	});
});

describe('GET /api/topics', () => {
	test('200: responds with an array of all topics with slug and description properties', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;
				expect(topics).toHaveLength(3);
				topics.forEach((topic) => {
					expect(topic).toMatchObject({
						description: expect.any(String),
						slug: expect.any(String),
					});
				});
			});
	});
});

describe('GET /api/articles', () => {
	test('200: returns an array of all articles sorted in desc order by date', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toHaveLength(13);
				expect(articles).toBeSortedBy('created_at', { descending: true });
				articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					});
				});
			});
	});
    test('404: endpoint not found', () => {
        return request(app)
        .get('/api/articules')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
});

describe('GET /api/articles/:article_id', () => {
	test('200: responds with an article selected by given id', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T20:11:00.000Z',
					votes: 100,
					article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
				});
			});
	});
	test('400: returns bad request when id NaN', () => {
		return request(app)
			.get('/api/articles/banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
	test('400: returns bad request when id outside of range', () => {
		return request(app)
			.get('/api/articles/9990')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
});
