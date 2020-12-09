const expect = require('chai').expect;
const { mockDatabase } = require('../../mock');
const { CommentController } = require('../../../api/controller');

describe('comment controller', function() {
	const tables = ['comment', 'person'];
	const person = {
		name: 'myname',
		email: 'test@meirim.org',
		password: 'xxxx',
		status: 1,
		id: 1,	
		type: 'type',
	};

	beforeEach(async function() {
		await mockDatabase.dropTables(tables);
		await mockDatabase.createTables(tables);
		await mockDatabase.insertData(['person'], { 'person': [person] });
	});

	afterEach(async function() {
		await mockDatabase.dropTables(tables);
	});

	it('creates row in db successfuly', async function() {
		const req = {
			session: {
				person: { 
					id: 1 
				} 
			},
			body: {
				name: 'myname',
				content: 'this is a brand new comment',
				person_id: 1,
				plan_id: 123,
				type: 'review',
				likes: 0
			}
		};
		const { attributes } = await CommentController.create(req);
		expect(attributes.person_id).to.eql(req.body.person_id);
		expect(attributes.plan_id).to.eql(req.body.plan_id);
		expect(attributes.type).to.eql(req.body.type);
		expect(attributes.content).to.eql(req.body.content);
		expect(attributes.likes).to.eql(req.body.likes);
		const addLikeRequest = {
			session: {
				person: { 
					id: 1 
				} 
			},
			body: { commentId: attributes.id }
		};
		const comment = await CommentController.addLike(addLikeRequest);
		const req1 = {
			session: {
				person: { 
					id: 1 
				} 
			},
			params: {
				plan_id: 123,
			}
		};
		const reqForNestedComment = {
			session: {
				person: { 
					id: 1 
				} 
			},
			body: {
				name: 'myname',
				content: 'this is nested comment',
				person_id: 1,
				parent_id: attributes.id,
				plan_id: 123,
				type: 'review',
				likes: 0
			}
		};
		await CommentController.create(reqForNestedComment);
		const comments = await CommentController.byPlan(req1); 
		expect(comments.length).to.eql(2);
		expect(comment.attributes.likes).to.eql(1);
	});
});