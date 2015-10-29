$(function() {
  var ACTIVE_VIEW = -1;

  var WHAT_TAB = $("#wte-what-tab");
  var WHERE_TAB = $("#wte-where-tab");
  var WHO_TAB = $("#wte-who-tab");
  var WHAT_CONTENT = $("#wte-what");
  var WHERE_CONTENT = $("#wte-where");
  var WHO_CONTENT = $("#wte-who");

  var MAP_WAS_INITIALIZED = false;

  var initMap = function() {
    if (!MAP_WAS_INITIALIZED) {
      window.navigator.geolocation.getCurrentPosition(loadMapWithLocation);
      MAP_WAS_INITIALIZED = true;
    }
  };

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

  var updateWho = function(place) {
    console.log(place === '');
    $("#wte-who-places").append('', '<li>' + place.name + '</li>');
  };

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
  * Find all selected foot-types
  */
  $('.btn-submit').on('click', function(e) {
    e.preventDefault();
    MAP_WAS_INITIALIZED = false;
    showView(1);
  });


  /**
  * Change class of an food-type if user clicks on it.
  */
  $('div.food-type p').on('click', function(e) {
    $('div.food-type-row').each(function() {
      $(this).removeClass('selected');
    });
    var el = $(e.target).parent().parent();
    el.toggleClass('selected');
  });
});
