$(function() {
  var ACTIVE_VIEW = -1;

  var WHAT_TAB = $("#wte-what-tab");
  var WHERE_TAB = $("#wte-where-tab");
  var WHO_TAB = $("#wte-who-tab");
  var WHAT_CONTENT = $("#wte-what");
  var WHERE_CONTENT = $("#wte-where");
  var WHO_CONTENT = $("#wte-who");

  var loadMapWithLocation = function(position) {
    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {center: here, zoom: 15};

    var map = new google.maps.Map(document.getElementById("wte-where"), mapOptions);
    map.getZoom();

    var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|0000FF|ffffff";
    var markerOptions = { map: map, position: here, icon: iconUrl};
    new google.maps.Marker(markerOptions);

    var placesSearchOptions = {location: here, radius: 300, types: ['restaurant'], keyword: 'Pizza'};

    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(placesSearchOptions, function(results, status) {
      if (status === "OK") {
        $("#wte-who-places").empty();
        results.forEach(function(place) {
          console.log(place);

          updateWho(place);
          var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FF0000|ffffff";
          var markerOptions = { map: map, position: place.geometry.location, icon: iconUrl};
          new google.maps.Marker(markerOptions);

        });
      } else {
        console.log("Error requesting places");
      }
    })
  };

  var updateWho = function(place) {
    $("#wte-who-places").append('', '<li>' + place.name + '</li>');
  };

  window.navigator.geolocation.getCurrentPosition(loadMapWithLocation);

  /**
  * Navigation
  * Our app has 3 states
  */
  WHAT_TAB.on("click", function() {showView(0)});
  WHERE_TAB.on("click", function() {showView(1)});
  WHO_TAB.on("click", function() {showView(2)});

  var showView = function(view) {

    // If the view didn't change, don't do anything
    if (view === ACTIVE_VIEW) {
      return;
    } else {
      ACTIVE_VIEW = view;
    }

    WHAT_CONTENT.hide();
    WHERE_CONTENT.hide();
    WHO_CONTENT.hide();

    if (view === 0) {
      WHAT_CONTENT.show();
    } else if (view === 1) {
      WHERE_CONTENT.show();
    } else {
      WHO_CONTENT.show();
    }
  };

  showView(0);

  /**
  * Change class of an food-type if user clicks on it.
  */
  $('div.food-type label').on('click', function(e) {
    var row = $(e.target).parent().parent();
    row.toggleClass('selected');
  });


});
