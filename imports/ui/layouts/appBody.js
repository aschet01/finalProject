// imports/ui/layouts/appBody.js
// Called from imports/ui/sstartup/client/routes.js

import { Template } from 'meteor/templating';
import { Locations } from '../../api/locations/locations.js';

import './appBody.html';
import './appBody.css';
import '../components/mapPanel/mapPanel.js';



Meteor.startup( function() {
  GoogleMaps.load({key: "AIzaSyA5WN6n6Un8oxxhV3TjJ-p_kaL9CunbCxg"});
});

Template.groupLocations.helpers({
  locations: function() {
    return Locations.find({});
  }
});

Template.groupLocations.events({
  "submit .newLocation": function(event) {
    event.preventDefault();

    const inputField = document.getElementById("newLocationBox");
    const newLocation = {
      location: inputField.value,
      createdAt: new Date()
    }

    Locations.insert(newLocation);
    inputField.value = "";
  },

  "submit .existingLocation": function(event) {
    event.preventDefault();

    const modifiedForm = event.target;
    const formInput = modifiedForm.getElementsByTagName("input")[0].value;

    Locations.update({_id: this._id}, {$set: {location: formInput}});
  },

  "click .removeLocation": function(event) {
    Locations.remove({_id: this._id});
  }
});

Template.appBody.events({
  "click #swapSidePanel": function(event) {
    // This is not the best way to swap between panels
    const markers = document.getElementsByClassName("sidePanelMarker");
    const currTemplateId = markers[0].id;

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
    const newLat = document.getElementById("latBox").value;
    const newLng = document.getElementById("lngBox").value;

    const newLatLng = new google.maps.LatLng(newLat, newLng);
    GoogleMaps.maps.map.instance.panTo(newLatLng);
  },
});

Template.findAddress.events({
  "click #enterAddress": function (event) {
    const geocoder = new google.maps.Geocoder();  
    const address = document.getElementById("addressBox").value;
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
    const director = new google.maps.DirectionsService;
    const displayer = new google.maps.DirectionsRenderer({
      map: GoogleMaps.maps.map.instance
    });

    const start = document.getElementById("origin").value;
    const end = document.getElementById("destination").value;

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
