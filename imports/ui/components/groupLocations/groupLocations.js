// imports/ui/components/groupLocations/groupLocations.js
// Called by imports/ui/components/groupKit/groupKit.js

import { Session } from 'meteor/session';

import { Locations } from '../../../api/locations/locations.js'
import { Markers } from '../../../api/markers/markers.js';
import { Places } from '../../../api/places/places.js';
import { PlaceTypes } from '../../../api/placeTypes/placeTypes.js';

import { chainHull_2D } from '../../../api/convex_hull/convex_hull.js';

export let markers = {};      // The actual google.maps.Markers
let centerMarker = {};
let activeArea = {};          // Polygon
let placeSearchOptions = {
  location: "",
  radius: 400,
  type: "food"
};

GoogleMaps.ready('map', function(map){
  geocoder = new google.maps.Geocoder();
  placesService = new google.maps.places.PlacesService(GoogleMaps.maps.map.instance);

  flagMarkerImage = {
    url: "flag.png",
    size: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  };

  Markers.find({sessionId: FlowRouter.getParam("id")}).observe({
    added: function (document) {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(document.lat, document.lng),
        map: GoogleMaps.maps.map.instance,
      });
      markers[document._id] = marker;

      zoomToMarkers();
      updateCenter();
    },

    changed: function (document) {
      let marker = markers[document._id];
      const newPosition = new google.maps.LatLng(document.lat, document.lng);
      marker.setPosition(newPosition);

      zoomToMarkers();
      updateCenter();
    },

    removed: function (document) {
      markers[document._id].setMap(null);
      delete markers[document._id];

      zoomToMarkers();
      updateCenter();
    }
  });
  clearPlaces();
});

// Geocoding callback functions
export function newLocationAndMarker(address, results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    const newCoords = results[0].geometry.location;
    
    // Create Location document with result coordinates
    let newLocation = {
      location: address,
      createdAt: new Date(),
      lat: newCoords.lat(),
      lng: newCoords.lng(),
      sessionId: FlowRouter.getParam("id")
    }

    // Get the new _id for the matching marker
    const newId = Locations.insert(newLocation);

    //  Create Marker document 
    const newLat = newCoords.lat();
    const newLng = newCoords.lng();

    Markers.insert({_id: newId, lat: newLat, lng: newLng, sessionId: FlowRouter.getParam("id")});

  } else {
    alert("Could not place address: " + status);
  }
}

export function changeLocationAndMarker(address, locationId, results, status) {
  if (status === google.maps.GeocoderStatus.OK) {
    const newCoords = results[0].geometry.location;
    Locations.update({_id: locationId}, 
                     {$set: {location: address, coords: newCoords}});

    Markers.update({_id: locationId},
                   {$set: {lat: newCoords.lat(), lng: newCoords.lng()}});

  } else {
    alert("Could not place address: " + status);
  }
}

// Center control
function updateCenter() {
  clearPlaces();
  clearPolygon();

  if (centerMarker instanceof google.maps.Marker) {
    centerMarker.setMap(null);
  }

  const center = getMarkerMean();

  if (center === null) {
    return;
  }

  centerMarker = new google.maps.Marker({
    position: center,
    map: GoogleMaps.maps.map.instance,
    animation: google.maps.Animation.DROP,
    icon: flagMarkerImage
  });

  updatePolygon();
  placeSearch(center);
}

function getMarkerMean() {
  let latSum = 0, lngSum = 0, count = 0;

  markerList = Markers.find({sessionId: FlowRouter.getParam("id")}).fetch();

  for (x in markerList) {
    let currMarker = markerList[x];
    latSum += currMarker.lat;
    lngSum += currMarker.lng;
    count += 1;
  }

  if (count <= 1) {
    return null;
  } else {
    return new google.maps.LatLng(latSum/count, lngSum/count);
  }
}

// Zoom functions
function zoomToMarkers() {
  const newBounds = getNewBounds();
  const myMap = GoogleMaps.maps.map.instance;

  // If there is only one marker
  if (newBounds === 1) {
    myMap.panTo(Markers.findOne());
  } else if (newBounds !== null) {
    myMap.fitBounds(newBounds);
  }
}

function getNewBounds() {
  const markerRange = getMarkerBounds();

  if (markerRange === null) {
    return null;
  } else {
    const multipleMarkers = (markerRange.minLat !== markerRange.maxLat ||
                              markerRange.minLng !== markerRange.maxLng);

    if (multipleMarkers) {
      const latRange = markerRange.maxLat - markerRange.minLat,
        lngRange = markerRange.maxLng - markerRange.minLng;

      // displayMargin: The ratio of the marker range to add
      //   to the edges of the view map view
      const displayMargin = .1;

      const displayMinLat = markerRange.minLat - displayMargin*latRange,
        displayMaxLat = markerRange.maxLat + displayMargin*latRange,
        displayMinLng = markerRange.minLng - displayMargin*lngRange,
        displayMaxLng = markerRange.maxLng + displayMargin*lngRange;

      return new google.maps.LatLngBounds(
        new google.maps.LatLng(displayMinLat, displayMinLng),
        new google.maps.LatLng(displayMaxLat, displayMaxLng)
      );
    } else {
      // Case for single Marker
      return 1;
    }
  }
}

function getMarkerBounds() {
  let minLat = 100, maxLat = 0, minLng = 0, maxLng = 0;
  const currMarkers = Markers.find({sessionId: FlowRouter.getParam("id")}).fetch();
  for (x in currMarkers) {
    const currLat = currMarkers[x].lat, currLng = currMarkers[x].lng;

    // Set initial values to first marker
    if (minLat === 100) {
      minLat = currLat; maxLat = currLat;
      minLng = currLng; maxLng = currLng;  

    } else {
      // Compare current Latitude
      if (currLat < minLat) {
        minLat = currLat;
      } else if (currLat > maxLat) {
        maxLat = currLat;
      }

      // Compare current Longitude
      if (currLng < minLng) {
        minLng = currLng;
      } else if (currLng > maxLng) {
        maxLng = currLng;
      }
    }
  }

  return (minLat !== 100 ? {
    minLat: minLat,
    maxLat: maxLat,
    minLng: minLng,
    maxLng: maxLng
  } : null);
}

// Polygon functions
function updatePolygon() {
  let hullPoints = [];
  const markerList = Markers.find({sessionId: FlowRouter.getParam("id")}).fetch();
  const numMarkers = markerList.length;

  if (numMarkers > 1) {
    const numHullPoints = chainHull_2D(markerList, numMarkers, hullPoints);

    // for (x in markers) {
    //   const currMarker = markers[x];
    //   let currCoords = {lat: currMarker.lat, lng: currMarker.lng};
    //   coords.push(currCoords);
    // }

    activeArea = new google.maps.Polygon({
      paths: hullPoints,
      fillColor: "purple",
      strokeColor: "purple"
    });
    activeArea.setMap(GoogleMaps.maps.map.instance);
  }
}

function clearPolygon() {
  if (activeArea instanceof google.maps.Polygon) {
    activeArea.setMap(null);
  }
}


// Generating places near the center
function placeSearch(point) {
  placeSearchOptions.location = point;
  placesService.nearbySearch(placeSearchOptions, readPlaces);
}

// PlacesService callback function
function readPlaces(results, status, pagination) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    let currPlace;
    for (x in results) {
      currPlace = results[x];
      console.log(currPlace);
      duplicate = Places.findOne({place_id: currPlace.place_id,
               sessionId: FlowRouter.getParam("id")});
      if (duplicate === undefined) {
        Places.insert({
          place_id: currPlace.place_id,
          name: currPlace.name,
          vicinity: currPlace.vicinity,
          types: currPlace.types,
          lat: currPlace.geometry.location.lat(),
          lng: currPlace.geometry.location.lng(),
          sessionId: FlowRouter.getParam("id")
        });
      } else {
        console.log("Duplicate blocked:", duplicate);
      }
    }
    if (pagination.hasNextPage) {
      setTimeout(pagination.nextPage(), 2005);
    }
  } else {
    console.log("Places service failed: ", status);
  }
}

function clearPlaces() {
  let ids = [];
  const placeList = Places.find({sessionId: FlowRouter.getParam("id")}).fetch();

  for (x in placeList) {
    Places.remove({_id: placeList[x]._id});
  }
}