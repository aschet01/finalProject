// imports/ui/layouts/appBody.js
// Called from imports/ui/sstartup/client/routes.js

import { Template } from 'meteor/templating';
import { Locations } from '../../api/locations/locations.js';

import './appBody.html';
import './appBody.css';
import '../components/mapPanel/mapPanel.js';



Meteor.startup( function () {
  GoogleMaps.load({key: "AIzaSyA5WN6n6Un8oxxhV3TjJ-p_kaL9CunbCxg"});
});

Template.groupLocations.helpers({
  locations: function() {
    return Locations.find({});
  }
});

Template.groupKit.events({
  "submit .newLocation": function(event) {
    event.preventDefault();
    const target = event.target;
    const newLocation = target.value;

    Locations.insert({
      newLocation,
      createdAt: new Date()
    });
  }
});

Template.appBody.events({
  "click #swapSidePanel": function(event) {
    // This is not the best way to swap between panels
    var markers = document.getElementsByClassName("sidePanelMarker");
    var currTemplateId = markers[0].id;

    if (currTemplateId === "testKitMarker") {
      BlazeLayout.render("appBody", {sidePanel: "groupKit", mainPanel: "mapPanel"});
    } else if (currTemplateId === "groupKitMarker") {
      BlazeLayout.render("appBody", {sidePanel: "testKit", mainPanel: "mapPanel"});      
    } else {
      console.log("Couldn't swap panel");
    }
  }
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

Template.findLatLng.events({
  "click #enterCoords": function (event) {
    var newLat = document.getElementById("latBox").value;
    var newLng = document.getElementById("lngBox").value;

    var newLatLng = new google.maps.LatLng(newLat, newLng);
    GoogleMaps.maps.map.instance.panTo(newLatLng);
  },
});

Template.findAddress.events({
  "click #enterAddress": function (event) {
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
});

Template.getDirections.events({
  "click #getDirections": function(event) {
    var director = new google.maps.DirectionsService;
    var displayer = new google.maps.DirectionsRenderer({
      map: GoogleMaps.maps.map.instance
    });

    var start = document.getElementById("origin").value;
    var end = document.getElementById("destination").value;

    director.route({
      origin: start, destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        displayer.setDirections(response);
      } else {
        window.alert("Directions not successful: " + status);
      }
    });
  }
});
