'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Clan = mongoose.model('Clan'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, clan;

/**
 * Clan routes tests
 */
describe('Clan CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Clan
		user.save(function() {
			clan = {
				name: 'Clan Name'
			};

			done();
		});
	});

	it('should be able to save Clan instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clan
				agent.post('/clans')
					.send(clan)
					.expect(200)
					.end(function(clanSaveErr, clanSaveRes) {
						// Handle Clan save error
						if (clanSaveErr) done(clanSaveErr);

						// Get a list of Clans
						agent.get('/clans')
							.end(function(clansGetErr, clansGetRes) {
								// Handle Clan save error
								if (clansGetErr) done(clansGetErr);

								// Get Clans list
								var clans = clansGetRes.body;

								// Set assertions
								(clans[0].user._id).should.equal(userId);
								(clans[0].name).should.match('Clan Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Clan instance if not logged in', function(done) {
		agent.post('/clans')
			.send(clan)
			.expect(401)
			.end(function(clanSaveErr, clanSaveRes) {
				// Call the assertion callback
				done(clanSaveErr);
			});
	});

	it('should not be able to save Clan instance if no name is provided', function(done) {
		// Invalidate name field
		clan.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clan
				agent.post('/clans')
					.send(clan)
					.expect(400)
					.end(function(clanSaveErr, clanSaveRes) {
						// Set message assertion
						(clanSaveRes.body.message).should.match('Please fill Clan name');
						
						// Handle Clan save error
						done(clanSaveErr);
					});
			});
	});

	it('should be able to update Clan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clan
				agent.post('/clans')
					.send(clan)
					.expect(200)
					.end(function(clanSaveErr, clanSaveRes) {
						// Handle Clan save error
						if (clanSaveErr) done(clanSaveErr);

						// Update Clan name
						clan.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Clan
						agent.put('/clans/' + clanSaveRes.body._id)
							.send(clan)
							.expect(200)
							.end(function(clanUpdateErr, clanUpdateRes) {
								// Handle Clan update error
								if (clanUpdateErr) done(clanUpdateErr);

								// Set assertions
								(clanUpdateRes.body._id).should.equal(clanSaveRes.body._id);
								(clanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Clans if not signed in', function(done) {
		// Create new Clan model instance
		var clanObj = new Clan(clan);

		// Save the Clan
		clanObj.save(function() {
			// Request Clans
			request(app).get('/clans')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Clan if not signed in', function(done) {
		// Create new Clan model instance
		var clanObj = new Clan(clan);

		// Save the Clan
		clanObj.save(function() {
			request(app).get('/clans/' + clanObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', clan.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Clan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clan
				agent.post('/clans')
					.send(clan)
					.expect(200)
					.end(function(clanSaveErr, clanSaveRes) {
						// Handle Clan save error
						if (clanSaveErr) done(clanSaveErr);

						// Delete existing Clan
						agent.delete('/clans/' + clanSaveRes.body._id)
							.send(clan)
							.expect(200)
							.end(function(clanDeleteErr, clanDeleteRes) {
								// Handle Clan error error
								if (clanDeleteErr) done(clanDeleteErr);

								// Set assertions
								(clanDeleteRes.body._id).should.equal(clanSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Clan instance if not signed in', function(done) {
		// Set Clan user 
		clan.user = user;

		// Create new Clan model instance
		var clanObj = new Clan(clan);

		// Save the Clan
		clanObj.save(function() {
			// Try deleting Clan
			request(app).delete('/clans/' + clanObj._id)
			.expect(401)
			.end(function(clanDeleteErr, clanDeleteRes) {
				// Set message assertion
				(clanDeleteRes.body.message).should.match('User is not logged in');

				// Handle Clan error error
				done(clanDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Clan.remove().exec();
		done();
	});
});