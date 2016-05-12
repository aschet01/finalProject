// imports/api/placeTypes/placeTypes.js
// Defined PlaceTypes collection

import { Mongo } from 'meteor/mongo';
export const PlaceTypes = new Mongo.Collection('placeTypes');

if (Meteor.isServer) {
  Meteor.publish('placeTypes', function listPlaces(){
    return PlaceTypes.find({});
  });
}