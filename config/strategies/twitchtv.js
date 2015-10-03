'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	TwitchtvStrategy = require('passport-twitchtv').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
  passport.use(new TwitchtvStrategy({
      clientID: config.twitchtv.clientID,
      clientSecret: config.twitchtv.clientSecret,
      callbackURL: config.twitchtv.callbackURL,
      scope: 'user_read'
    },
    function(req, accessToken, refreshToken, profile, done) {

      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        displayName: profile.displayName,
        username: profile.username,
        email: profile.email,
        provider: 'twitchtv',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};