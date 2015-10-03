'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Marker = mongoose.model('Marker'),
  Clan = mongoose.model('Clan'),
	_ = require('lodash');

/**
 * Create a Marker
 */
exports.create = function(req, res) {
	var marker = new Marker(req.body);
	marker.user = req.user;

	marker.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marker);
		}
	});
};

/**
 * Show the current Marker
 */
exports.read = function(req, res) {
	res.jsonp(req.marker);
};

/**
 * Update a Marker
 */
exports.update = function(req, res) {
	var marker = req.marker ;

	marker = _.extend(marker , req.body);

	marker.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marker);
		}
	});
};

/**
 * Delete an Marker
 */
exports.delete = function(req, res) {
	var marker = req.marker;

	marker.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(marker);
		}
	});
};

/**
 * List of Markers
 */
exports.list = function(req, res) {
	Marker.find({$and:[{user: req.user._id}, {clan: ''}]}).sort('-created').populate('user', 'displayName').exec(function(err, markers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(markers);
		}
	});
};

/**
 * List of Clan Markers
 */
exports.listClan = function(req, res) {
  res.jsonp(req.marker);
};

/**
 * Marker middleware
 */
exports.markerByID = function(req, res, next, id) { 
	Marker.findById(id).populate('user', 'displayName').exec(function(err, marker) {
		if (err) return next(err);
		if (! marker) return next(new Error('Failed to load Marker ' + id));
		req.marker = marker ;
		next();
	});
};

/**
 * Clan Marker middleware
 */
exports.markersByClanID = function(req, res, next, id) { 
  Marker.find({clan: id}).populate('user', 'displayName').exec(function(err, marker) {
    if (err) return next(err);
    if (! marker) return next(new Error('Failed to load Marker ' + id));
    req.marker = marker ;
    next();
  });
};

/**
 * Marker authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if(req.marker.clan !== ''){

    Clan.findById(req.marker.clan).populate('user', 'displayName').exec(function(err, clan) {

          for (var i=0; i<clan.members.length; i++){
            var clanMember = clan.members[i];
            
            if(clanMember.id === req.user.id || clan.user.id === req.user.id){
              console.log('testing match');
              next();
            }
          }

    });

  } else if (req.marker.user.id === req.user.id) {
    next();
  } else if (req.marker.user.id !== req.user.id) {
  	return res.status(403).send('User is not authorized');
  }
	
};
