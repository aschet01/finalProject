// imports/api/places/places.js
// Defined Places collection

import { Mongo } from 'meteor/mongo';
export const Places = new Mongo.Collection('places');

if (Meteor.isServer) {
  Meteor.publish('places', function listPlaces(){
    return Places.find();
  });
}

Meteor.methods({
  'places.mySession'(sessionId) {
    return Places.find({sessionId: sessionId}).fetch();
  },

  'places.insert'(newPlace) {
    return Places.insert(newPlace);
  },

  'places.remove'(query) {
    return Places.remove(query);
  },

  'places.findOne'(query) {
    return Places.findOne(query);
  }
});