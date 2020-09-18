var searchButtonEl = document.querySelector("#searchbutton");
var cityInputEl = document.querySelector("#city-search");
var cityCasesEl = document.querySelector(".city-cases");
var cityDeathsEl = document.querySelector(".city-deaths");
var cityHeaderEl = document.querySelector(".city-header");
var cardContainer = document.querySelector(".card-container");
var cityName = cityInputEl.value.trim();

// array to store cities in local storage
var cities = [];

$(document).ready(function () {
  $('#modal1').modal();

  $('input.autocomplete').autocomplete({
    data: {
      "Alameda": null,
      "Alpine": null,
      "Amador": null,
      "Butte": null,
      "Calaveras": null,
      "Colusa": null,
      "Contra Costa": null,
      "Del Norte": null,
      "El Dorado": null,
      "Fresno": null,
      "Glenn": null,
      "Humboldt": null,
      "Imperial": null,
      "Inyo": null,
      "Kern": null,
      "Kings": null,
      "Lake": null,
      "Lassen": null,
      "Los Angeles": null,
      "Madera": null,
      "Marin": null,
      "Mariposa": null,
      "Mendocino": null,
      "Merced": null,
      "Modoc": null,
      "Mono": null,
      "Monterey": null,
      "Napa": null,
      "Nevada": null,
      "Orange": null,
      "Placer": null,
      "Plumas": null,
      "Riverside": null,
      "Sacramento": null,
      "San Benito": null,
      "San Bernardino": null,
      "San Diego": null,
      "San Francisco": null,
      "San Joaquin": null,
      "San Luis Obispo": null,
      "San Mateo": null,
      "Santa Barbara": null,
      "Santa Clara": null,
      "Santa Cruz": null,
      "Shasta": null,
      "Sierra": null,
      "Siskiyou": null,
      "Solano": null,
      "Sonoma": null,
      "Stanislaus": null,
      "Sutter": null,
      "Tehama": null,
      "Trinity": null,
      "Tulare": null,
      "Tuolumne": null,
      "Ventura": null,
      "Yolo": null,
      "Yuba": null,
    },
  });
});

//function to grab user's city search choice
var searchButtonHandler = function (event) {
  //prevent browser from sending user's input data to a URL
  event.preventDefault();
  //get value
  var cityName = cityInputEl.value.trim();
  //add cityName to list
  if (cityName) {
    //make sure cityName is one of the counties on the drop down list (if (cityName === data[i]????))
    //reset cityInput
    cityInputEl.value = "";
    cardContainer.textContent = "";
    appendCity(cityName);
    //add to local storage
    saveCity(cityName);
    getCoordinates(cityName);
    getResults(cityName);
  }
};

//function to add city to list
var appendCity = function (cityName) {
  if (cities.indexOf(cityName) === -1) {
    //append to list
    var cityItem = document.createElement("li");
    cityItem.classList = "collection-item";
    cityItem.textContent = cityName;
    var cityList = document.querySelector(".collection");
    cityList.appendChild(cityItem);
  }
}

//function to add city to local storage
var saveCity = function (cityName) {
  //array for old searches
  cities.push(cityName);
  localStorage.setItem("cities", JSON.stringify(cities));
};

//function to load cities from local storage on page refresh
var loadCity = function () {
  cities = JSON.parse(localStorage.getItem("cities"));
  if (cities === null) {
    cities = [];
  };
  for (var i = 0; i < cities.length; i++) {
    var cityItem = document.createElement("li");
    cityItem.classList = "collection-item";
    cityItem.textContent = cities[i];
    var cityList = document.querySelector(".collection");
    cityList.appendChild(cityItem);
  }
}

searchButtonEl.addEventListener("click", searchButtonHandler);

var covidCasesApi = "cf11de0d-32c5-451a-bfd1-dd7b1951978a";
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: '# of Cases',
      data: [50, 90, 150, 300, 450, 500, 1000, 1250, 1600, 1900, 2000,],
      backgroundColor:
        'rgba(128, 203, 196, 0.4)',
      borderColor:
        'rgba(0, 96, 100, 1)',
      borderWidth: 1,
    }]
  },

  options: {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'COVID-19 Cases',
      fontSize: 25,
    },
    configuration: {
      maintainAspectRatio: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// fetch and show Covid Case and Deaths for selected County
var getResults = function (cityName) {
  var resultsApiUrl = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + cityName;
  fetch(resultsApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var i = data.result.records.length - 1;
      cityHeaderEl.textContent = data.result.records[i].county;
      cityCasesEl.textContent = "Covid Cases: " + data.result.records[i].totalcountconfirmed;
      cityDeathsEl.textContent = "Covid Deaths: " + data.result.records[i].totalcountdeaths;
    });
}

//FUNCTION to convert CITYNAME into Long/Lat coordinates
var getCoordinates = function (cityName) {
  var coordinatesApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityName + "&key=AIzaSyAbDIvcfoHMHKqc3Qo-TB3OGNGoRBGTUJo";
  fetch(coordinatesApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityLatitude = data.results[0].geometry.location.lat;
      var cityLongitude = data.results[0].geometry.location.lng;
      getTestSites(cityLatitude, cityLongitude);
    })

}

//hardcoding testing site API until we have a drop down select menu for city
var getTestSites = function (cityLatitude, cityLongitude) {
  var testingApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=X0SijTp9QmtmfIHB8-dU1wKqKEFl9qFxGxhIhiG1_b0&q=Covid&at=" + cityLatitude + "," + cityLongitude + "&limit=5";
  fetch(testingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < 5; i++) {
        //add testing center title to cards, add testing address to cards
        var cardTitle = document.createElement("span");
        var cardContent = document.createElement("div");
        var card = document.createElement("div");
        var cardAddress = document.createElement("a");
        var cardBody = document.createElement("div");
        cardBody.classList = "card-action";
        cardAddress.classList = "facility-address";
        cardAddress.id = "facility-address";
        cardAddress.textContent = data.items[i].address.houseNumber + " " + data.items[i].address.street + ", " + data.items[i].address.county + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
        cardAddress.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + cardAddress.textContent);
        cardAddress.setAttribute("target", "_blank")
        cardTitle.classList = "card-title";
        cardTitle.textContent = data.items[i].title.split(":")[1];
        cardContent.classList = "card-content white-text";
        card.classList = "card darken-1 col s112 m5 l2";
        //append card title and address to the page
        cardContent.appendChild(cardTitle);
        card.appendChild(cardContent);
        cardBody.appendChild(cardAddress);
        card.appendChild(cardBody);
        cardContainer.appendChild(card);
      }
    });
}

loadCity();