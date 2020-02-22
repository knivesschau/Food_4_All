'use strict';

//navigate through the app with these event listeners. 
function navigationListener() {
  $("#food-bank-link").on('click', function(event) {
      $(".food-bank-page").show().removeClass("hidden"); 
      $(".landing-page").hide(); 
      $(".food-insecurity-page").hide();
    });

  $("#food-insecurity-link").on('click', function(event) {
    $(".food-insecurity-page").show().removeClass("hidden"); 
    $(".landing-page").hide(); 
    $(".food-bank-page").hide(); 
  });

  $("#home-page-link1, #home-page-link2").on('click', function(event) {
    $(".landing-page").show(); 
    $(".food-insecurity-page").hide().addClass("hidden"); 
    $(".food-bank-page").hide().addClass("hidden"); 
  });
}

let markers = [];

function initAutocomplete() {
    console.log("ran!");

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0522, lng: -118.2437},
        scrollwheel: false,
        zoom: 12,
        gestureHandling: 'auto',
        maptypeId: 'roadmap'
    });
}

$(navigationListener);


// OLD CODE FROM FIRST VERSION: 

// let input = document.getElementById('pac-input'); 
// let searchBox = new google.maps.places.SearchBox(input);
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// map.addListener('bounds_changed', function() {
//   searchBox.setBounds(map.getBounds());
// });

// searchBox.addListener('places_changed', function() {
//   let places = searchBox.getPlaces();

//   if (places.length == 0) {
//     return;
//   }

// let service = new google.maps.places.PlacesService(map);
// let infowindow = new google.maps.InfoWindow();  

//   markers.forEach(function(marker) {
//     marker.setMap(null);
//   });
//   markers= [];

//   let bounds = new google.maps.LatLngBounds();

//   places.forEach(function(place) {
//     let marker = new google.maps.Marker({
//       map: map,
//       title: place.name,
//       position: place.geometry.location,
//       placeId: place.place_id
//     });

//   markers.push(marker);

//   google.maps.event.addListener(marker, 'click', function(event) {
//       service.getDetails({placeId: this.placeId}, (function(marker) {
//         return function(place, status) {
//           if (status === google.maps.places.PlacesServiceStatus.OK) {
//             infowindow.setContent(
//               `<div id="info"> 
//               <span id="name"><b>${place.name}</b></span>
//               <br>
//               <span id="address">${place.formatted_address}</span>
//               <br>
//               <span id="website"><a href=${place.website}>Website</a></span>
//               <br>
//               <span id="google-map"><a href=${place.url}>Open in Google Maps</a></span>
//               </div>`);
//             infowindow.open(map, marker);
//             }
//         }
//       }
//     (marker)));
//   });

//   if (place.geometry.viewport) {
//     bounds.union(place.geometry.viewport);
//   } else {
//     bounds.extend(place.geometry.location);
//   }

// });
// map.fitBounds(bounds);
// });
// }