// imports/api/places/places.js
// Defined Places collection

import { Mongo } from 'meteor/mongo';
export const Places = new Mongo.Collection('places');

if (Meteor.isServer) {
  Meteor.publish('places', function listPlaces(){
    return Places.find();
  });
}