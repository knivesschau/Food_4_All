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

function initAutocomplete() {
    console.log("ran!");

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.714286, lng: -117.155577},
        scrollwheel: false,
        zoom: 12,
        maptypeId: 'roadmap'
    });

    let input = document.getElementById('pac-input'); // can maybe do $().val() here??
    let searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
  
    let markers = [];

    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }

      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      let bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        let icon = {
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
  
        markers.push(new google.maps.Marker({
          map: map,
          url: place.icon,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));
  
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
      });

//    let request = {
//        placeId: input,
//        fields: ['name', 'formatted_address', 'place_id', 'geometry']
//      }

//   let infowindow = new google.maps.InfoWindow(); 
//   let service = new google.maps.places.PlacesService(map);

//   service.getDetails(request, function(place, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//         let marker = new google.maps.Marker({
//           map: map,
//           position: place.geometry.location
//           });
//       }
//     google.maps.event.addListener(marker, 'click', function() {
//         infowindow.setContent('<div><strong>' + place.name + '</strong><br' + 
//           'Place ID: ' + place.place_id + '<br>' + 
//           place.formatted_addresss + '</div>');
//           infowindow.open(map, this);
//           });
//       }); 
}

$(navigationListener);
