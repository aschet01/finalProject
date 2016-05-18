// imports/startup/client/index.js
// Called by client/main.js
// Point of origin for client code

import './routes.js';
import "../../ui/layouts/appBody.js";

Meteor.startup( function() {
  GoogleMaps.load({
    key: Meteor.settings.public.devKey,
    libraries: "places"
  });
});