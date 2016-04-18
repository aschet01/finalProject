// imports/ui/components/groupKit/groupKit.js
// Called by imports/ui/layouts/appBody/appBody.js

import { Locations } from '../../../api/locations/locations.js'
import { Markers } from '../../../api/markers/markers.js';
import './groupKit.html';

Template.groupLocations.helpers({
  locations: function() {
    return Locations.find({});
  }
});

function newLocationandMarker(address, results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    const newCoords = results[0].geometry.location;
    GoogleMaps.maps.map.instance.panTo(newCoords);
    
    var newLocation = {
      location: address,
      createdAt: new Date(),
      coords: newCoords
    }
    Locations.insert(newLocation);
    console.log(Locations.find().fetch());

    const newId = Locations.findOne({createdAt: newLocation.createdAt})["_id"];
    const newLat = newCoords.lat();
    const newLng = newCoords.lng();

    Markers.insert({_id: newId, lat: newLat, lng: newLng});

  } else {
    alert("Geocoding was not successful: " + status);
  }
}


Template.groupLocations.events({
  "submit .newLocation": function(event) {
    event.preventDefault();

    const inputField = document.getElementById("newLocationBox");
    const inputAddress = inputField.value;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': inputAddress},
                      function(results, status, address=inputAddress) {
                              newLocationandMarker(address, results, status)});

    inputField.value = "";
  },

  "submit .existingLocation": function(event) {
    event.preventDefault();

    const modifiedForm = event.target;
    const formInput = modifiedForm.getElementsByTagName("input")[0].value;

    // Need to add geocoding
    Locations.update({_id: this._id}, {$set: {location: formInput}});
  },

  "click .removeLocation": function(event) {
    Locations.remove({_id: this._id});
    Markers.remove({_id: this._id});
  }
});


var markers = {};

Markers.find().observe({
  added: function (document) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(document.lat, document.lng),
      map: GoogleMaps.maps.map.instance,
    });
    markers[document._id] = marker;
  },

  changed: function (document) {

  },

  removed: function (document) {
    markers[document._id].setMap(null);
    delete markers[document._id];
  }
});