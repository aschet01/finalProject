// imports/ui/components/groupKit/groupKit.js
// Called by imports/ui/layouts/appBody/appBody.js

import { Session } from 'meteor/session';

import { Locations } from '../../../api/locations/locations.js'
import { Markers } from '../../../api/markers/markers.js';
import { Places } from '../../../api/places/places.js';
import { PlaceTypes } from '../../../api/placeTypes/placeTypes.js';

import { newLocationAndMarker } from '../groupLocations/groupLocations.js';
import { changeLocationAndMarker } from '../groupLocations/groupLocations.js';
import { markers } from '../groupLocations/groupLocations.js';
import './groupKit.html';

if (Meteor.isClient) {
  Meteor.subscribe('places');
  Meteor.subscribe('locations');
  Meteor.subscribe('markers');
  Meteor.subscribe('placeTypes');
}

let currentPlace = {};

Template.groupLocations.helpers({
  locations: function() {
    return Locations.find({sessionId: FlowRouter.getParam("id")});
  }
});

Template.groupLocations.events({
  "submit .newLocation": function(event) {
    event.preventDefault();

    const inputField = document.getElementById("newLocationBox");
    const inputAddress = inputField.value;

    geocoder.geocode({'address': inputAddress}, function(results, status) {
        newLocationAndMarker(inputAddress, results, status);
    });

    inputField.value = "";
  },

  "submit .existingLocation": function(event) {
    event.preventDefault();

    const modifiedForm = event.target;
    const inputAddress = modifiedForm.getElementsByTagName("input")[0].value;
    const docId = this._id

    geocoder.geocode({address: inputAddress},
      function(results, status, address=inputAddress, locationId=docId) {
        changeLocationAndMarker(address, locationId, results, status);
    });
  },

  "click .removeLocation": function(event) {
    Locations.remove({_id: this._id});
    Markers.remove({_id: this._id});
  }
});

Template.placeList.helpers({
  places: function() {
    // let activeTypes = [];
    // const placeTypes = PlaceTypes.find({display: true}).fetch();
    // return Places.find({"types": {$in: activeTypes}});
    return Places.find({sessionId: FlowRouter.getParam("id")});
  },

  placeTypes: function() {
    return PlaceTypes.find();
  }
});

Template.placeList.events({
  "click .place-type": function(event) {
    this.display = false;
  },
  
  "click .list-group-item": function(event) {
    if (currentPlace instanceof google.maps.Marker) {
      currentPlace.setMap(null);
      delete currentPlace;
    }

    // currentPlace = new google.maps.Marker({
    //   position: this.geometry.location,
    //   map: GoogleMaps.maps.map.instance
    // });
  }
});
