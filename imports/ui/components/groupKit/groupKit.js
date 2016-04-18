// imports/ui/components/groupKit/groupKit.js
// Called by imports/ui/layouts/appBody/appBody.js

import { Locations } from '../../../api/locations/locations.js'
import { Markers } from '../../../api/markers/markers.js';
import './groupKit.html';

// Dictionary to hold Marker objeccts referenced by 
//   documents in Markers collection
var markers = {};

Template.groupLocations.helpers({
  locations: function() {
    return Locations.find({});
  }
});


// Geocoding callback functions
function newLocationandMarker(address, results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    const newCoords = results[0].geometry.location;
    GoogleMaps.maps.map.instance.panTo(newCoords);
    
    // Create Location document with result coordinates
    var newLocation = {
      location: address,
      createdAt: new Date(),
      coords: newCoords
    }
    Locations.insert(newLocation);

    //  Create Marker document 
    const newId = Locations.findOne({createdAt: newLocation.createdAt})["_id"];
    const newLat = newCoords.lat();
    const newLng = newCoords.lng();

    Markers.insert({_id: newId, lat: newLat, lng: newLng});

  } else {
    alert("Geocoding was not successful: " + status);
  }
}

function changeLocationandMarker(address, locationId, results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    const newCoords = results[0].geometry.location;
    Locations.update({_id: locationId}, 
                     {$set: {location: address, coords: newCoords}});

    Markers.update({_id: locationId},
                   {$set: {lat: newCoords.lat(), lng: newCoords.lng()}});

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
    geocoder.geocode({'address': inputAddress}, function(results, status) {
        newLocationandMarker(inputAddress, results, status);
    });

    inputField.value = "";
  },

  "submit .existingLocation": function(event) {
    event.preventDefault();

    const modifiedForm = event.target;
    const inputAddress = modifiedForm.getElementsByTagName("input")[0].value;

    const docId = this._id
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: inputAddress},
      function(results, status, address=inputAddress, locationId=docId) {
        changeLocationandMarker(address, locationId, results, status);
    });
  },

  "click .removeLocation": function(event) {
    Locations.remove({_id: this._id});
    Markers.remove({_id: this._id});
  }
});


Markers.find().observe({
  added: function (document) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(document.lat, document.lng),
      map: GoogleMaps.maps.map.instance,
    });
    markers[document._id] = marker;
  },

  changed: function (document) {
    var marker = markers[document._id];
    const newPosition = new google.maps.LatLng(document.lat, document.lng);
    marker.setPosition(newPosition);
    GoogleMaps.maps.map.instance.panTo(newPosition);
  },

  removed: function (document) {
    markers[document._id].setMap(null);
    delete markers[document._id];
  }
});