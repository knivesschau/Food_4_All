'use strict';

const testKey = "AIzaSyBBydFcLANTMh9X7_9S-0YpZuy7bPNFAYY";
const foodBankSearch = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

function submitFoodBank() {
    console.log("app loaded!");
    $("#food-bank-selector").on("submit", function(event) {
        event.preventDefault();
        const bankEntry = $(this).find("#food-bank").val();
        getFoodBank(bankEntry);
    });
}

function convertQuery(parameters) {
    const searchData = Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`);
    return searchData.join("&");
}

function getFoodBank(bankEntry) {
    const parameters = { 
        input: bankEntry,
        inputtype: 'textquery',
        fields: ['formatted_address', 'geometry', 'icon,name', 'permanently_closed', 'photos', 'place_id', 'plus_code', 'types'],
        key: testKey,
    };

    const searchString = convertQuery(parameters);
    const searchQuery = foodBankSearch + '?' + searchString;
    console.log(searchQuery);

    fetch(searchQuery, {
        mode: 'no-cors',
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
            })
        .then(responseJson => showFoodBank(responseJson))
        .catch(error => alert("Something went wrong. Try again later."));
}

function showFoodBank(responseJson) {
    $("#food-bank-list").empty();
    $("#food-bank-list").append(`
    <li><h3>${responseJson.data.name}</h3>`);
    $("#search-results").removeClass("hidden");
}

$(submitFoodBank);