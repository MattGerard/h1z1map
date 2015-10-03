'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Marker Schema
 */
var MarkerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  clan: {
    type: String,
    default: ''
  },
  locationLong: {
    type: Number,
    default: null,
    required: 'There was an error with your marker location. Please select your location again.'
  },
  locationLat: {
    type: Number,
    default: null,
    required: 'There was an error with your marker location. Please select your location again.'
  },
  markerType: {
    type: Number,
    default: 1,
  }
});

mongoose.model('Marker', MarkerSchema);