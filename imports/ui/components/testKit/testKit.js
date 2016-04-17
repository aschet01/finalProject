// imports/ui/components/testKit/testKit.js
// Called from imports/ui/templates/appBody.js

import './testKit.html';

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
