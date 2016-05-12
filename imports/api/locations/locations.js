// imports/api/locations/locations.js
// Defines Locations collection

import { Mongo } from 'meteor/mongo';
export const Locations = new Mongo.Collection('locations');

if (Meteor.isServer) {
  Meteor.publish('locations', function listLocations(token){
    return Locations.find({sessionId: token});
  });
}