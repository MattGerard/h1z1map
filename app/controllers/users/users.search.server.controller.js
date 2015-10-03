'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');


/**
 * Search User
 */
exports.search = function(req, res) {
  res.json(req.user || null);
};

exports.userByusername = function(req, res, next) {
  
  var username = req.params.username;
  User.findOne({
    username: username
  }).exec(function(err, user) {
    if (err) { 
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
     }
    if (!user) { 
      return res.status(400).send({
        message: 'Unable to find user: ' + username
      });
     }
    if (user) {
      var member = {_id: user._id, username: user.username};
      res.json(member || null);
    }
  });

};

/**
 * Update user details
 */
exports.add = function(req, res) {
 
  //console.log(req.user);
  //console.log(req.userReq);

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  var user = req.user;
  var friend = req.userReq;
  var friendID = friend._id;
  if (user) {

    delete req.body.roles;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.friends.push(friendID);

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });

  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }

};