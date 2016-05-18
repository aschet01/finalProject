// imports/api/markers/markers.js
// Defines Markers collection

import { Mongo } from 'meteor/mongo';
export const Markers = new Mongo.Collection('markers');

if (Meteor.isServer) {
  Meteor.publish('markers', function listMarkers(){
    return Markers.find();
  });
}