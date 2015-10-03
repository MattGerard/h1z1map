'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var clans = require('../../app/controllers/clans.server.controller');

	// Clans Routes
	app.route('/clans')
		.get(clans.list)
		.post(users.requiresLogin, clans.create);

	app.route('/clans/:clanId')
		.get(clans.read)
		.put(users.requiresLogin, clans.hasAuthorization, clans.update, clans.userByID)
		.delete(users.requiresLogin, clans.hasAuthorization, clans.delete);

	// Finish by binding the Clan middleware
	app.param('clanId', clans.clanByID);
};
