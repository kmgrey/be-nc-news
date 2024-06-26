const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const request = require('supertest');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/incorrect_endpoint', () => {
    test('404: endpoint not found when passed non-existent endpoint', () => {
		return request(app)
			.get('/api/banana')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
})

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

describe('GET /api/users', () => {
	test('200: responds with an array of users ', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				const { users } = body;
				expect(users).toHaveLength(4);
				users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
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
                    comment_count: 11,
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
	test('404: returns not found when id outside of range', () => {
		return request(app)
			.get('/api/articles/9990')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
});

describe('GET /api/articles/:article_id/comments', () => {
	test('200: returns array of comments from selected article ', () => {
		return request(app)
			.get('/api/articles/9/comments')
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toHaveLength(2);
				expect(comments).toEqual([
					{
						comment_id: 1,
						body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
						votes: 16,
						author: 'butter_bridge',
						article_id: 9,
						created_at: '2020-04-06T12:17:00.000Z',
					},
					{
						comment_id: 17,
						body: 'The owls are not what they seem.',
						votes: 20,
						author: 'icellusedkars',
						article_id: 9,
						created_at: '2020-03-14T17:02:00.000Z',
					},
				]);
				expect(comments).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('200: returns longer array of comments from selected article sorted by most recent', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toHaveLength(11);
				expect(comments).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('400: returns bad request when id is NaN', () => {
		return request(app)
			.get('/api/articles/banana/comments')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
	test('404: returns not found when id outside of range', () => {
		return request(app)
			.get('/api/articles/999/comments')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
});

describe('POST /api/articles/:article_id/comments', () => {
	test('201: inserts new comment and returns it', () => {
		const newComment = {
			username: 'butter_bridge',
			body: "I can't believe it's not butter",
		};
		return request(app)
			.post('/api/articles/1/comments')
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toEqual(
					expect.objectContaining({
						comment_id: 19,
						body: "I can't believe it's not butter",
						article_id: 1,
						author: 'butter_bridge',
						votes: 0,
						created_at: expect.any(String),
					})
				);
			});
	});
	test('404: returns not found when invalid user sent', () => {
		const badUser = {
			username: 'not_a_user',
			body: 'This should fail right?',
		};
		return request(app)
			.post('/api/articles/1/comments')
			.send(badUser)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
	test('404: returns not found when id outside of range', () => {
		const newComment = {
			username: 'butter_bridge',
			body: "I can't believe it's not butter",
		};
		return request(app)
			.post('/api/articles/9999/comments')
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
	test('400: returns bad request when id is NaN', () => {
		const newComment = {
			username: 'butter_bridge',
			body: "I can't believe it's not butter",
		};
		return request(app)
			.post('/api/articles/banana/comments')
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
	test('400: returns bad request if invalid comment sent', () => {
		const badComment = {
			username: 'butter_bridge',
		};
		return request(app)
			.post('/api/articles/1/comments')
			.send(badComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
});

describe('PATCH /api/articles/:article_id', () => {
	test('200: updates the votes for an article by id - upvote', () => {
		const upvotes = { inc_votes: 50 };
		return request(app)
			.patch('/api/articles/1')
			.send(upvotes)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: expect.any(String),
					votes: 150,
					article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
				});
			});
	});
	test('200: updates the votes for an article by id - downvote', () => {
		const downvotes = { inc_votes: -200 };
		return request(app)
			.patch('/api/articles/1')
			.send(downvotes)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: expect.any(String),
					votes: -100,
					article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
				});
			});
	});
	test('404: responds with not found when the article id does not exist', () => {
		const upvotes = { inc_votes: 50 };
		return request(app)
			.patch('/api/articles/999')
			.send(upvotes)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
	test('400: responds with bad request when the data is invalid', () => {
		const invalidData = { inc_votes: 'banana' };
		return request(app)
			.patch('/api/articles/1')
			.send(invalidData)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
	test('400: responds with bad request when article id not valid', () => {
		const invalidData = { inc_votes: 50 };
		return request(app)
			.patch('/api/articles/banana')
			.send(invalidData)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
});

describe('DELETE /api/comments/:comment_id', () => {
	test('204: deletes a comment by comment id and reutrns nothing', () => {
		return request(app)
			.delete('/api/comments/1')
			.expect(204)
			.then(({ body }) => {
				expect(body).toEqual({});
			});
	});
	test('400: responds bad request when comment id is nan', () => {
		return request(app)
			.delete('/api/comments/banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad Request');
			});
	});
	test('404: responds not found when comment id is non-existent', () => {
		return request(app)
			.delete('/api/comments/999')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
});

describe('GET /api/articles?topic', () => {
	test('200: returns an array of articles with queried topic', () => {
		return request(app)
			.get('/api/articles?topic=cats')
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toHaveLength(1);
				expect(articles).toEqual([
					{
						author: 'rogersop',
						title: 'UNCOVERED: catspiracy to bring down democracy',
						article_id: 5,
						topic: 'cats',
						created_at: '2020-08-03T13:14:00.000Z',
						votes: 0,
						article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
						comment_count: 2,
					},
				]);
			});
	});
	test('404: returns not found if invalid topic queried', () => {
		return request(app)
			.get('/api/articles?topic=banana')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not Found');
			});
	});
});
