'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Marker = mongoose.model('Marker'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, marker;

/**
 * Marker routes tests
 */
describe('Marker CRUD tests', function() {
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

		// Save a user to the test db and create new Marker
		user.save(function() {
			marker = {
				name: 'Marker Name'
			};

			done();
		});
	});

	it('should be able to save Marker instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marker
				agent.post('/markers')
					.send(marker)
					.expect(200)
					.end(function(markerSaveErr, markerSaveRes) {
						// Handle Marker save error
						if (markerSaveErr) done(markerSaveErr);

						// Get a list of Markers
						agent.get('/markers')
							.end(function(markersGetErr, markersGetRes) {
								// Handle Marker save error
								if (markersGetErr) done(markersGetErr);

								// Get Markers list
								var markers = markersGetRes.body;

								// Set assertions
								(markers[0].user._id).should.equal(userId);
								(markers[0].name).should.match('Marker Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Marker instance if not logged in', function(done) {
		agent.post('/markers')
			.send(marker)
			.expect(401)
			.end(function(markerSaveErr, markerSaveRes) {
				// Call the assertion callback
				done(markerSaveErr);
			});
	});

	it('should not be able to save Marker instance if no name is provided', function(done) {
		// Invalidate name field
		marker.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marker
				agent.post('/markers')
					.send(marker)
					.expect(400)
					.end(function(markerSaveErr, markerSaveRes) {
						// Set message assertion
						(markerSaveRes.body.message).should.match('Please fill Marker name');
						
						// Handle Marker save error
						done(markerSaveErr);
					});
			});
	});

	it('should be able to update Marker instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marker
				agent.post('/markers')
					.send(marker)
					.expect(200)
					.end(function(markerSaveErr, markerSaveRes) {
						// Handle Marker save error
						if (markerSaveErr) done(markerSaveErr);

						// Update Marker name
						marker.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Marker
						agent.put('/markers/' + markerSaveRes.body._id)
							.send(marker)
							.expect(200)
							.end(function(markerUpdateErr, markerUpdateRes) {
								// Handle Marker update error
								if (markerUpdateErr) done(markerUpdateErr);

								// Set assertions
								(markerUpdateRes.body._id).should.equal(markerSaveRes.body._id);
								(markerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Markers if not signed in', function(done) {
		// Create new Marker model instance
		var markerObj = new Marker(marker);

		// Save the Marker
		markerObj.save(function() {
			// Request Markers
			request(app).get('/markers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Marker if not signed in', function(done) {
		// Create new Marker model instance
		var markerObj = new Marker(marker);

		// Save the Marker
		markerObj.save(function() {
			request(app).get('/markers/' + markerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', marker.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Marker instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marker
				agent.post('/markers')
					.send(marker)
					.expect(200)
					.end(function(markerSaveErr, markerSaveRes) {
						// Handle Marker save error
						if (markerSaveErr) done(markerSaveErr);

						// Delete existing Marker
						agent.delete('/markers/' + markerSaveRes.body._id)
							.send(marker)
							.expect(200)
							.end(function(markerDeleteErr, markerDeleteRes) {
								// Handle Marker error error
								if (markerDeleteErr) done(markerDeleteErr);

								// Set assertions
								(markerDeleteRes.body._id).should.equal(markerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Marker instance if not signed in', function(done) {
		// Set Marker user 
		marker.user = user;

		// Create new Marker model instance
		var markerObj = new Marker(marker);

		// Save the Marker
		markerObj.save(function() {
			// Try deleting Marker
			request(app).delete('/markers/' + markerObj._id)
			.expect(401)
			.end(function(markerDeleteErr, markerDeleteRes) {
				// Set message assertion
				(markerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Marker error error
				done(markerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Marker.remove().exec();
		done();
	});
});