'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Clan = mongoose.model('Clan'),
  User = mongoose.model('User'),
  Marker = mongoose.model('Marker'),
	_ = require('lodash');

/**
 * Create a Clan
 */
exports.create = function(req, res) {

  Clan.find({ user: req.user._id }).sort('-created').populate('user', 'displayName').exec(function(err, clans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if(clans.length < 1) {

      var clan = new Clan(req.body);
      clan.user = req.user;

      clan.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(clan);
        }
      });

    } else if(clans.length >= 1){
      return res.status(400).send({
        message: 'You\'ve already created a Clan.'
      });
    }
  });

};

/**
 * Show the current Clan
 */
exports.read = function(req, res) {
	res.jsonp(req.clan);
};

/**
 * Update a Clan
 */
exports.update = function(req, res) {
	var clan = req.clan ;

	clan = _.extend(clan , req.body);

	clan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clan);
		}
	});
};

exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    next();
  });
};

/**
 * Delete an Clan
 */
exports.delete = function(req, res) {
	var clan = req.clan ;
	clan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
      Marker.find({clan: clan._id}).sort('-created').populate('user', 'displayName').exec(function(err, markers) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          for (var i=0; i<markers.length; i++){
              var marker = markers[i];
              marker.remove( { _id: marker._id } );
          }
        }
      });
			res.jsonp(clan);
		}
	});
};

/**
 * List of Clans
 */
exports.list = function(req, res) { 
	Clan.find({ $or: [ { members: { $elemMatch: { username: req.user.username } } }, {user: req.user._id} ] }).sort('-created').populate('user', 'displayName').exec(function(err, clans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clans);
		}
	});
};

/**
 * Clan middleware
 */
exports.clanByID = function(req, res, next, id) { 
	Clan.findById(id).populate('user', 'displayName').exec(function(err, clan) {
		if (err) return next(err);
		if (! clan) return next(new Error('Failed to load Clan ' + id));
		req.clan = clan ;
		next();
	});
};

/**
 * Clan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.clan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
