var map;
initMap = function () {
    var myLatLng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      center: myLatLng,
      zoom: 8,
      // mapTypeId: google.maps.MapTypeId.HYBRID
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

Template.body.helpers({
  initMap: function () {
    var myLatLng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      center: myLatLng,
      zoom: 8,
      // mapTypeId: google.maps.MapTypeId.HYBRID
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
});