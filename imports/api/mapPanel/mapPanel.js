// imports/ui/components/mapPanel/mapPanel.js
// Called by imports/ui/layouts/appBody.js

import { Template } from 'meteor/templating';
import "./mapPanel.html";


// I'd like this block here, but it only works in appBody.js now

// Template.mapPanel.helpers({
//   mapOptions: function () {
//     if (GoogleMaps.loaded()) {
//       console.log("Map options passed");
//       return {
//         center: new google.maps.LatLng(-34.397, 150.644),
//         zoom: 8
//       };
//     } else {
//       console.log("GoogleMaps not loaded");
//     }
//   }
// });
