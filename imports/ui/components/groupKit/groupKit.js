// imports/ui/components/groupKit/groupKit.js
// Called by imports/ui/layouts/appBody/appBody.js

import { Locations } from '../../../api/locations/locations.js'
import './groupKit.html';

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
      if (status === google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
          _id: this._id,
          position: results[0].geometry.location,
          map: GoogleMaps.maps.map.instance
        });
        GoogleMaps.maps.map.instance.panTo(marker.position);
      } else {
        alert("Geocoding was not successful: " + status);
      }
    });

    const newLocation = {
      location: inputAddress,
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
