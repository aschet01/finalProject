// imports/startup/client/index.js
// Called by client/main.js
// Point of origin for client code

import './routes.js';
import "../../ui/layouts/appBody.js";

Meteor.startup( function() {
  GoogleMaps.load({key: "AIzaSyA5WN6n6Un8oxxhV3TjJ-p_kaL9CunbCxg"});
});