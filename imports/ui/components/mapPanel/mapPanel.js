// imports/ui/components/mapPanel/mapPanel.js
// Called by imports/ui/layouts/appBody.js

import "./mapPanel.html";

// I'd like to move this to mapPanel.js, but I haven't gotten that working
Template.mapPanel.helpers({
  mapOptions: function () {
    if (GoogleMaps.loaded()) {
      const centralizeStyles = [
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { saturation: -60 }
          ]
        },{
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            { hue: "#00ffee" },
            { saturation: 50 }
          ]
        },{
          featureType: "poi.business",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }

        // {
        //   featureType: "road",
        //   elementType: "geometry.stroke",
        //   stylers: [
        //     {hue: "#00D4FF"}
        //   ]
        // }
      ];

      return {
        center: new google.maps.LatLng(41.3, -72.9),
        zoom: 9,
        styles: centralizeStyles
      };
    }
  }
});