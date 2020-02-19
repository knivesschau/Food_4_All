'use strict';

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

    let service = new google.maps.places.PlacesService(map);
    let infowindow = new google.maps.InfoWindow();

      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers= [];

      let bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        let marker = new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location,
          placeId: place.place_id
        });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function(evt) {
          service.getDetails({placeId: this.placeId}, (function(marker) {
            return function(place, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                infowindow.setContent(
                  `<div id="info"> 
                  <span id="name"><b>${place.name}</b></span>
                  <br>
                  <span id="address">${place.formatted_address}</span>
                  <br>
                  <span id="number">${place.formatted_phone_number}</span>
                  <br>
                  <span id="website"><a href=${place.website}>Website</a></span>
                  <br>
                  <span id="google-map"><a href=${place.url}>Open in Google Maps</a></span>
                  </div>`);
                infowindow.open(map, marker);
                }
            }
          }
        (marker)));
      });

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    
    });

  map.fitBounds(bounds);
    });
  }

$(navigationListener);