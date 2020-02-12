'use strict';

//TO-DO: SEE WHERE MORE JQUERY CAN BE APPLIED.
//TO-DO: BREAK UP CODE SO IT LOOKS LESS LIKE SPAGHETTI CODE. PRIORITIZE WHAT TO INITIALIZE.
//TO-DO: HOW TO INTEGRATE MORE FETCH? => CORS-ANYWHERE? 
//TO-DO: FIND WAY TO INTEGRATE SOME JSON MANIPULATION AFTER MAP SEARCH WORKS. 
//TO-DO: STYLE!

const testKey = "AIzaSyBBydFcLANTMh9X7_9S-0YpZuy7bPNFAYY";
const foodBankSearch = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

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
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
  
        markers.push(new google.maps.Marker({
          map: map,
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
  }

$(navigationListener);

// OLD CODE BELOW, FETCH DID NOT WORK BECAUSE OF HOW THE API WORKS. NEEDED TO USE SPECIFIC MAPS JS API LIBRARY.

// function submitFoodBank() {
//     console.log("app loaded!");
//     $("#food-bank-selector").on("submit", function(event) {
//         event.preventDefault();
//         const bankEntry = $(this).find("#food-bank").val();
//         getFoodBank(bankEntry);
//     });
// }

// function convertQuery(parameters) {
//     const searchData = Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`);
//     return searchData.join("&");
// }

// function getFoodBank(bankEntry) {
//     const parameters = { 
//         input: bankEntry,
//         inputtype: 'textquery',
//         fields: ['formatted_address', 'geometry', 'icon,name', 'permanently_closed', 'photos', 'place_id', 'plus_code', 'types'],
//         key: testKey,
//     };

//     const searchString = convertQuery(parameters);
//     const searchQuery = foodBankSearch + '?' + searchString;
//     console.log(searchQuery);

//     fetch(searchQuery)
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             }
//             throw new Error(response.statusText);
//             })
//         .then(responseJson => showFoodBank(responseJson))
//         .catch(error => alert("Something went wrong. Try again later."));
// }

// function showFoodBank(responseJson) {
//     console.log(responseJson);
//     $("#food-bank-list").empty();
//     $("#food-bank-list").append(`
//     <li><h3>${responseJson.data.name}</h3>`);
//     $("#search-results").removeClass("hidden");
// }

// $(submitFoodBank);