// imports/api/markers/markers.js
// Defines Markers collection

import { Mongo } from 'meteor/mongo';
export const Markers = new Mongo.Collection('markers');

if (Meteor.isServer) {
  Meteor.publish('markers', function listPlaces(){
    return Markers.find({});
  });
}

// var markers = {};

// GoogleMaps.ready(GoogleMaps.maps.map.instance, function(map) {
  // Markers.find().observe({
  //   added: function (document) {
  //     var marker = new google.maps.Marker({
  //       position: new google.maps.LatLng(document.lat, document.lng),
  //       map: map.instance,
  //     });

  //     markers[document._id] = marker;
  //   },

  //   changed: function (document) {

  //   },

  //   removed: function (document) {
  //     markers[document._id].setMap(null);
  //     delete markers[document._id];
  //   }

  // });
// });