'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var markers = require('../../app/controllers/markers.server.controller');

	// Markers Routes
	app.route('/markers')
		.get(markers.list)
		.post(users.requiresLogin, markers.create);

  // Clan Markers Routes
  app.route('/clanmarkers/:markersClanId')
    .get(markers.listClan)
    .post(users.requiresLogin, markers.create);

	app.route('/markers/:markerId')
		.get(markers.read)
		.put(users.requiresLogin, markers.hasAuthorization, markers.update)
		.delete(users.requiresLogin, markers.hasAuthorization, markers.delete);

	// Finish by binding the Marker middleware
	app.param('markerId', markers.markerByID);
  app.param('markersClanId', markers.markersByClanID);
};
