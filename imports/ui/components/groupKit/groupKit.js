// imports/ui/components/groupKit/groupKit.js
// Called by imports/ui/layouts/appBody/appBody.js

import { Locations } from '../../../api/locations/locations.js'
import { Markers } from '../../../api/markers/markers.js';
import './groupKit.html';

// Dictionary to hold Marker objeccts referenced by 
//   documents in Markers collection
var markers = {};
var centerMarker = {};

Template.groupLocations.helpers({
  locations: function() {
    return Locations.find({});
  }
});

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
    updateCenter();
  },

  changed: function (document) {
    var marker = markers[document._id];
    const newPosition = new google.maps.LatLng(document.lat, document.lng);
    marker.setPosition(newPosition);
    GoogleMaps.maps.map.instance.panTo(newPosition);
    updateCenter();
  },

  removed: function (document) {
    markers[document._id].setMap(null);
    delete markers[document._id];
    updateCenter();
  }
});

function updateCenter() {
  var latSum = 0;
  var lngSum = 0;
  var count = 0;

  for (x in markers) {
    var coords = markers[x].getPosition();
    latSum += coords.lat();
    lngSum += coords.lng();
    count += 1;
  }

  var center = new google.maps.LatLng(latSum/count, lngSum/count);
  console.log(centerMarker);

  if (centerMarker instanceof google.maps.Marker) {
    centerMarker.setPosition(center);
  } else {
    centerMarker = new google.maps.Marker({
      position: center,
      map: GoogleMaps.maps.map.instance
    });
  }
}


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