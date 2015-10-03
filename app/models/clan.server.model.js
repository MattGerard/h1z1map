'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Clan Schema
 */
var ClanSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Clan name',
		trim: true
	},
  content: {
    type: String,
    default: '',
    trim: true
  },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
  'members': [
  ],
  managers: [
  ]
});

mongoose.model('Clan', ClanSchema);