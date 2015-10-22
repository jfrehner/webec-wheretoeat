$(function() {
  var ACTIVE_VIEW = -1;

  var loadMapWithLocation = (position) => {
    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {center: here, zoom: 15};

    var map = new google.maps.Map(document.getElementById("wte-where"), mapOptions);
    map.getZoom();

    var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|0000FF|ffffff";
    var markerOptions = { map: map, position: here, icon: iconUrl};
    new google.maps.Marker(markerOptions);

    var placesSearchOptions = {location: here, radius: 300, types: ['restaurant'], keyword: 'Pizza'}

    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(placesSearchOptions, function(results, status) {
      if (status === "OK") {
        results.forEach((place) => {
          console.log(place);

          var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FF0000|ffffff";
          var markerOptions = { map: map, position: place.geometry.location, icon: iconUrl};
          new google.maps.Marker(markerOptions);

        });
      } else {
        console.log("Error requesting places");
      }
    })
  }

  window.navigator.geolocation.getCurrentPosition(loadMapWithLocation);

  /**
  * Navigation
  * Our app has 3 states
  */
  $("#wte-what-tab").on("click", () => {showView(0)});
  $("#wte-where-tab").on("click", () => {showView(1)});
  $("#wte-who-tab").on("click", () => {showView(2)});

  var showView = (view) => {

    // If the view didn't change, don't do anything
    if (view === ACTIVE_VIEW) {
      return;
    } else {
      ACTIVE_VIEW = view;
    }

    $('#wte-what').hide();
    $('#wte-where').hide();
    $('#wte-who').hide();

    if (view === 0) {
      $('#wte-what').show();
    } else if (view === 1) {
      $('#wte-where').show();
    } else {
      $('#wte-who').show();
    }
  }

  showView(0);
});
