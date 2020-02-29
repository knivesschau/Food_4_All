'use strict';

const url = `https://services1.arcgis.com/RLQu0rK7h4kbsBq5/arcgis/rest/services/Store_Locations/FeatureServer/0/query`;

// initialize map on SNAP retailer page
let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.0902, lng: -95.7129},
      scrollwheel: false,
      zoom: 3,
      gestureHandling: 'auto',
      maptypeId: 'roadmap'
    });
    
} 

// navigate through the app with these event listeners
function navigationListener() {
  $("#snap-link").on('click', function(event) {
      $(".snap-page").fadeIn().removeClass("hidden"); 
      $(".landing-page").hide(); 
      $(".food-insecurity-page").hide();
    });

  $("#food-insecurity-link").on('click', function(event) {
    $(".food-insecurity-page").fadeIn().removeClass("hidden"); 
    $(".landing-page").hide(); 
    $(".snap-page").hide(); 
  });

  $("#home-page-link1, #home-page-link2").on('click', function(event) {
    $(".landing-page").fadeIn(); 
    $(".food-insecurity-page").hide().addClass("hidden"); 
    $(".snap-page").hide().addClass("hidden"); 
  });
}

// show answers to questions on the food insecurity info page.
function openQuestions() {
  $("#food-insec1").on('click', function(event) {
      $("#answer-1").fadeIn().removeClass("hidden");
      $("#answer-2").fadeOut();
  })

  $("#food-insec2").on('click', function(event) {
    $("#answer-2").fadeIn().removeClass("hidden");
    $("#answer-1").fadeOut();
  })
}

// convert search parameters from the SNAP API into URI components
function getQuerys(parameters) {
  const snapData = Object.keys(parameters).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`
      })
  return snapData.join("&");
}

// captures user ZIP code value on form and reset form
function watchZip() {
  $(".zip-code-form").on("submit", function(){
      event.preventDefault(); 
      const userZip = $("#zip-input").val(); 
      getSnapStores(userZip);
      clearMarkers(markers);
    });

  // $(".zip-code-form").on("")
}

// interact with the SNAP API to fetch data for the app 
function getSnapStores(userZip) {
  const parameters = {
    where: `UPPER(Zip5) like '%${userZip}%'`,
    outFields: "*",
    outSR: "4326",
    f: "json"
  }

  const queryString = getQuerys(parameters); 
  const searchURL = url + '?' + queryString; 

  Promise.all([fetch(searchURL)]) 
      .then(response => {
          if(response[0].ok) {
                return response[0].json(); 
          }
      throw new Error(response[0].statusText);
      })
      .then(responseJson => {
        if (!responseJson.features.length) {
          $("#error-msg").fadeIn(); 
          } 
        else {  
          $("#error-msg").hide();
          displaySnapStores(responseJson);
          getMarkers(responseJson);
          }
      })
      .catch(error => {
        console.log(error);
        alert("An error occurred. Please try again later.")
        }); 
}

// displays results client-side in list form and makes store names interactive
function displaySnapStores(responseJson) {
  $(".snap-results").removeClass("hidden");
  $(".snap-results").empty(); 

  for (let i = 0; i < responseJson.features.length; i++) {

  let storeInfo = 
    `<ul>
    <li>
    <a class="name">${responseJson.features[i].attributes.Store_Name}</a>
    <p>${responseJson.features[i].attributes.Address}</p>
    
    <p>${responseJson.features[i].attributes.City}, 
    ${responseJson.features[i].attributes.State}, 
    ${responseJson.features[i].attributes.Zip5}</p>
    
    </li>
    </ul>`

  $(".snap-results").append(storeInfo);
  
  $("#result-list a").each(function(i,e) {
    $(e).click(function(i) {
          return function(e) {
            google.maps.event.trigger(markers[i], 'click');
            map.setZoom(16);
          }
        }(i));
    });
  };
};


// clear markers on each new search
function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  };
  markers = [];
}

// displays results as markers on the map wth corresponding info.
function getMarkers(responseJson) {
    let bounds = new google.maps.LatLngBounds(); 
    let infowindow = new google.maps.InfoWindow();

    for (let i = 0; i < responseJson.features.length; i++) {
      
      let lat = parseFloat(`${responseJson.features[i].attributes.Latitude}`);
      let long = parseFloat(`${responseJson.features[i].attributes.Longitude}`);
      let coordinates = new google.maps.LatLng(lat, long);

      let info = `<h4 id="store-name">${responseJson.features[i].attributes.Store_Name}</h4>
      <p id="address1">${responseJson.features[i].attributes.Address}</p>
      <span id="address2">${responseJson.features[i].attributes.City}, 
      ${responseJson.features[i].attributes.State}, 
      ${responseJson.features[i].attributes.Zip5}</span>`
      
      let marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: coordinates,
          map: map
      });
    
    markers.push(marker);
    bounds.extend(coordinates);
    
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(info);
          infowindow.open(map, marker);
          }
      })(marker, i));
  }
  map.fitBounds(bounds);
}

// initialize event handler functions
function initializeApp() {
  navigationListener(); 
  watchZip(); 
  openQuestions();
}

$(initializeApp);