$(function() {
  var ACTIVE_VIEW = 0;
/*
  var getPosition = (position) => {
    console.log(position.coords.latitude, position.coords.longitude);
  }

  window.navigator.geolocation.getCurrentPosition(getPosition);

  var here = new google.maps.LatLng(47.3, 45.3);

  var mapOptions = {center: here, zoom: 15};

  var map = new google.maps.Map($("#wte-where-tab"), mapOptions);
  map.getZoom();

  var placesSearchOptions = {location: here, radius: 300, types: ['restaurant'], keyword: 'Pizza'}

  var service = new google.maps.places.PlacesServices(map);

  service.nearbySearch(placesSearchOptions, function(results, status) {
    //todo
  })
*/
  /**
  * Navigation
  * Our app has 3 states
  */
  $("#wte-what-tab").on("click", () => {showView(0)});
  $("#wte-where-tab").on("click", () => {showView(1)});
  $("#wte-who-tab").on("click", () => {showView(2)});

  function showView(view) {

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

});
