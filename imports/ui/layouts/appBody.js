// imports/ui/layouts/appBody.js
// Called from imports/ui/startup/client/index.js

// import { Template } from 'meteor/templating';

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
