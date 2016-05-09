// imports/ui/components/mapPanel/mapPanel.js
// Called by imports/ui/layouts/appBody.js

import "./mapPanel.html";

// https://developers.google.com/maps/documentation/javascript/styling#style-array-example
const mutedBlueStyle = [
  {
    featureType: "all",
    stylers: [
      // { saturation: -20 }
    ]
  },{
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      // {color: "#68C5E0"},
      // {saturation: 20},
      {visibility: "off"}
    ]
  },{
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {color: "#8195A7"},
      {saturation: 20},
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { hue: "#00FFEE" },
      { saturation: 50 }
    ]
  },{
    featureType: "poi.business",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

// https://snazzymaps.com/style/25/blue-water
const blueWater = [
  {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#444444"
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
          {
              "color": "#f2f2f2"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
          {
              "saturation": -100
          },
          {
              "lightness": 45
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#46bcec"
          },
          {
              "visibility": "on"
          }
      ]
  }
];

// Adapted from https://snazzymaps.com/style/92/blue-cyan
const greyStyle =  [
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#ffffff"}
    ]
  },{
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      {"color": "#000000"},
      {"lightness": 20}
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {"visibility": "on"},
      {"color": "#333333"}
    ]
  },{
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {"visibility": "on"},
      {"color": "#CCCCCC"}
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      {"visibility": "on"},
      {"color": "#9C9DA7"}
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {"lightness": -40}
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {"color": "#808080"}
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {"color": "#7AF2F2"},
      {"lightness": 20}
    ]
  },{
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.fill",
    "stylers": [
      {"visibility": "on"},
      {"color": "#cccccc"}
    ]
  },{
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {"color": "#E00000"},
      {"lightness": 0}
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {"color": "#F1E902"},
      {"lightness": 60}
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {"visibility": "off"}
    ]
  },{
    "featureType": "road.local",
    "stylers": [
    ]
  // },
  // {
  //   "featureType": "administrative",
  //   "elementType": "geometry.stroke",
  //   "stylers": [
  //     {"color": "#aaaaaa"}
  //   ]
  // },{
  //   "featureType": "administrative",
  //   "elementType": "labels.text"
  }
];

// I'd like to move this to mapPanel.js, but I haven't gotten that working
Template.mapPanel.helpers({
  mapOptions: function () {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(41.3, -72.9),
        zoom: 9,
        styles: blueWater
      };
    }
  }
});
