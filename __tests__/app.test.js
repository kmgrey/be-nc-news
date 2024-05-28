const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const request = require('supertest');

beforeEach(() => seed(data));
afterAll(() => db.end());

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
