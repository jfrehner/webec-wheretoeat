$(function() {
  var ACTIVE_VIEW = -1;


  /**
  * Selector for the What-Tab.
  */
  var WHAT_TAB = $("#wte-what-tab");


  /**
  * Selector for the Where-Tab.
  */
  var WHERE_TAB = $("#wte-where-tab");


  /**
  * Selector for the Who-Tab.
  */
  var WHO_TAB = $("#wte-who-tab");


  /**
  * Selector for the What-View.
  */
  var WHAT_CONTENT = $("#wte-what");


  /**
  * Selector for the Where-View.
  */
  var WHERE_CONTENT = $("#wte-where");


  /**
  * Selector for the Who-View.
  */
  var WHO_CONTENT = $("#wte-who");


  /**
  * Booelan that indicats if the google map has been initialized or not.
  */
  var MAP_WAS_INITIALIZED = false;

  /**
  * Initializes the google-map if it hasn't been done yet.
  */
  var initMap = function() {
    if (!MAP_WAS_INITIALIZED) {
      window.navigator.geolocation.getCurrentPosition(loadMapWithLocation);
      MAP_WAS_INITIALIZED = true;
    }
  };


  /**
  * Gets the goole map and the markers.
  */
  var loadMapWithLocation = function(position) {
    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {center: here, zoom: 15};

    var map = new google.maps.Map(document.getElementById("wte-where"), mapOptions);
    map.getZoom();

    var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=0|0000FF|ffffff";
    var markerOptions = { map: map, position: here, icon: iconUrl};
    new google.maps.Marker(markerOptions);

    var food = '';

    food = $('div#foods .food-type-row.selected .food-type').attr('id');

    var placesSearchOptions = {location: here, radius: 300, types: ['restaurant'], keyword: food};

    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(placesSearchOptions, function(results, status) {
      if (status === "OK") {
        $("#wte-who-places").empty();
        results.forEach(function(place, index) {
          console.log(place);

          updateWho(place);
          var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (index + 1) + "|FF0000|ffffff";
          var markerOptions = { map: map, position: place.geometry.location, icon: iconUrl};
          new google.maps.Marker(markerOptions);

        });
      } else if(status === "ZERO_RESULTS") {
        console.log("No results found");
        $("#wte-who-places").append('Unfortunately, there\'s no such restaurant-type near you :(');
      } else {
        console.log("Error requesting places");
      }
    });
  };


  /**
  * Updates the "Who"-List of restaurants that provide the selected food-type.
  */
  var updateWho = function(place) {
    $("#wte-who-places").append('', '<li>' + place.name + '</li>');
  };


  /**
  * Navigation
  * Our app has 3 states: (0) What (1) Where (2) Who
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
    WHAT_TAB.removeClass('active');
    WHERE_TAB.removeClass('active');
    WHO_TAB.removeClass('active');

    if (view === 0) {
      WHAT_CONTENT.show();
      WHAT_TAB.addClass('active');
    } else if (view === 1) {
      WHERE_CONTENT.show();
      WHERE_TAB.addClass('active');
      initMap();
    } else {
      WHO_CONTENT.show();
      WHO_TAB.addClass('active');
    }
  };

  showView(0);


  /**
  * Show Where-View when user clicks on the "Find Me Places!"-Button.
  */
  $('.btn-submit').on('click', function(e) {
    e.preventDefault();
    MAP_WAS_INITIALIZED = false;
    showView(1);
  });


  /**
  * Change class of an food-type if user clicks on the food-type-rectangle.
  */
  $('div.food-type p').on('click', function(e) {
    $('div.food-type-row').each(function() {
      $(this).removeClass('selected');
    });
    var el = $(e.target).parent().parent();
    el.toggleClass('selected');
  });
});
