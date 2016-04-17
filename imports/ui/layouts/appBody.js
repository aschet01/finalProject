// imports/ui/layouts/appBody.js
// Called from imports/ui/sstartup/client/routes.js

// import { Template } from 'meteor/templating';
import { Locations } from '../../api/locations/locations.js';

import './appBody.html';
import './appBody.css';
import '../components/mapPanel/mapPanel.js';
import '../components/testKit/testKit.js';
import '../components/groupKit/groupKit.js';


Template.appBody.events({
  "click #swapSidePanel": function(event) {
    // This is not the best way to swap between panels
    const markers = document.getElementsByClassName("sidePanelMarker");
    const currTemplateId = markers[0].id;

    if (currTemplateId === "testKitMarker") {
      BlazeLayout.render("appBody", {sidePanel: "groupKit",
                                     mainPanel: "mapPanel"});
    } else if (currTemplateId === "groupKitMarker") {
      BlazeLayout.render("appBody", {sidePanel: "testKit",
                                     mainPanel: "mapPanel"});
    } else {
      console.log("Couldn't swap panel");
    }
  }
});

// I'd like to moev this to mapPanel.js, but I haven't gotten that working
Template.mapPanel.helpers({
  mapOptions: function () {
    if (GoogleMaps.loaded()) {
      console.log("Map options passed");
      return {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8
      };
    } else {
      console.log("GoogleMaps not loaded");
    }
  }
});
