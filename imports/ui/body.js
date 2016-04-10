import { Template } from 'meteor/templating';
import './body.html';
import './body.css';

if (Meteor.isClient) {
  Meteor.startup( function () {
    GoogleMaps.load({key: "AIzaSyA5WN6n6Un8oxxhV3TjJ-p_kaL9CunbCxg"});
  });
}

Template.mapPanel.events({
});

Template.mapPanel.helpers({
  mapOptions: function () {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8
      };
    }
  },

  makeMap: function () {
    GoogleMaps.create({
      name: "map",
      element: document.getElementById("map"),
      options: {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      }
    });
  }
});

Template.sidePanel.events({
    "click #enterCoords": function (event) {
      var newLat = document.getElementById("latBox").value;
      var newLng = document.getElementById("lngBox").value;

      var newLatLng = new google.maps.LatLng(newLat, newLng);
      GoogleMaps.maps.map.instance.panTo(newLatLng);
    },

    "click #enterAddress": function () {
      var geocoder = new google.maps.Geocoder();  
      var address = document.getElementById("addressBox").value;
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          GoogleMaps.maps.map.instance.panTo(results[0].geometry.location);
        } else {
          alert("Geocoding was not successful: " + status);
        }
      });
    }
  // "click button": function (event) {
  //   var buttonClicked = event.target.id;
  //   var currMap = GoogleMaps.maps.map.instance;

  //   if (buttonClicked === "enterCoords") {
  //     var newLat = document.getElementById("latBox").value;
  //     var newLng = document.getElementById("lngBox").value;

  //     var newLatLng = new google.maps.LatLng(newLat, newLng);
  //     currMap.panTo(newLatLng);

  //   } else if (buttonClicked === "enterAddress") {
  //     var geocoder = new google.maps.Geocoder();  
  //     var address = document.getElementById("addressBox").value;
  //     geocoder.geocode({'address': address}, function(results, status) {
  //       if (status === google.maps.GeocoderStatus.OK) {
  //         currMap.panTo(results[0].geometry.location);
  //       } else {
  //         alert("Geocoding was not successful: " + status);
  //       }
  //     });
  //   }
  // }
});
