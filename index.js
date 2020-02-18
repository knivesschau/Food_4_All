'use strict';

//TO-DO: SEE WHERE MORE JQUERY CAN BE APPLIED.
//TO-DO: BREAK UP CODE SO IT LOOKS LESS LIKE SPAGHETTI CODE. PRIORITIZE WHAT TO INITIALIZE.
//TO-DO: HOW TO INTEGRATE MORE FETCH? => CORS-ANYWHERE? 
//TO-DO: FIND WAY TO INTEGRATE SOME JSON MANIPULATION AFTER MAP SEARCH WORKS. 
//TO-DO: STYLE!

function navigationListener() {
  $("#food-bank").on('click', function(event) {
      $(".food-bank-page").show().removeClass("hidden"); 
      $(".landing-page").hide(); 
  //  REMEMBER TO ADD FOOD INSECURITY LISTENER WHEN IT'S BUILT OUT. 
    })
}

let markers = [];

function initAutocomplete() {
    console.log("ran!");

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.714286, lng: -117.155577},
        scrollwheel: false,
        zoom: 12,
        maptypeId: 'roadmap'
    });

    let input = document.getElementById('pac-input'); 
    let searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }

      markers.forEach(function(marker) {
        marker.setMap(null);
      });

      let bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }       

      markers.push(new google.maps.Marker({
          map: map,
          title: places.name,
          position: place.geometry.location,
        }));
  
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

      map.addListener('center_changed', function() {
        window.setTimeout(function() {
          map.panTo(marker.getPosition());
        }, 3000);
        });
  
      marker.addListener('click', function() {
        map.setZoom(18);
        map.setCenter(marker.getPosition());
      });
      
  });
  map.fitBounds(bounds);
    });
  }



$(navigationListener);
