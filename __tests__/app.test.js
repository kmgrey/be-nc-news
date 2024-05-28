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
