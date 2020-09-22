var locAction = document.querySelector(".loc-action");
var locContainer = document.querySelector(".loc-container");
var chartEl = document.querySelector("#chart-container");
var cities = [];
var cityCasesEl = document.querySelector(".city-cases");
var cityDeathsEl = document.querySelector(".city-deaths");
var cityHeaderEl = document.querySelector(".city-header");
var cityInputEl = document.querySelector("#city-search");
var cityList = document.querySelector(".collection");
//var cntyName = cityInputEl.value.trim();
//var cntyName = "Los Angeles"
var currentCity = document.querySelector(".current-city");
var dataBaseInfo = [];
var deleteButtonEl = document.querySelector("#clear-storage-btn")
var facilitiesHeader = document.querySelector(".facilities-header");
var navBtn = document.querySelector("#navigate-button");
var navContent = document.querySelector(".modal-content");
var navHeader = document.querySelector(".facility-name");
var navMap = document.querySelector("#nav-map");
var searchButtonEl = document.querySelector("#searchbutton");
var faciltyName = document.querySelector(".loc-title");
var testingLoc = document.querySelector("#testingLoc");


$(document).ready(function () {
  $('#modal1').modal();
  $('#modal2').modal();
  $('#modal3').modal();

});
  
var getCntyName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var cntyName = queryString.split("=")[1];
  
    if (cntyName) {
      // display repo name on the page
      testingLoc.textContent=cntyName.replace(/%20/g, " ");
      searchHistory(cntyName);
  
      //getRepoIssues(cntyName);
    } else {
      // if no repo was given, redirect to the homepage
      document.location.replace("./index.html");
    }
    
};

//function to grab user's city search choice
var searchButtonHandler = function (event) {
  //prevent browser from sending user's input data to a URL
  // event.preventDefault();
  //get value
  var cntyName = cityInputEl.value.trim();
  var splitStr = cntyName.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  cntyName = splitStr.join(' ');

  //add cntyName to list
  if (cntyNames[cntyName] === null) {
    //make sure cntyName is one of the counties on the drop down list (if (cntyName === data[i]????))
    //reset cityInput
    locContainer.innerHTML = "";
    // cityInputEl.value = "";
    chartEl.innerHTML= "";
    appendCity(cntyName);
    //add to local storage
    //saveCity(cntyName);
    getCoordinates(cntyName);
    //getResults(cntyName);
  }
}  
var searchHistory = function (cntyName) {
  
  if (cntyName) {
    //cityInputEl.value = "";
   // locContainer.textContent = "";
    //chartEl.innerHTML = "";
    getCoordinates(cntyName);
   // getResults(cntyName);
  }
}

//function to add city to list
var appendCity = function (cntyName) {
  if (cities.indexOf(cntyName) === -1) {
    //append to list
    var cityItem = document.createElement("li");
    cityItem.classList = "collection-item";
    cityItem.textContent = cntyName;
    cityList.appendChild(cityItem);
  }
}



//FUNCTION to convert cntyName into Long/Lat coordinates
var getCoordinates = function (cntyName) {
  var coordinatesApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cntyName + "&key=AIzaSyAbDIvcfoHMHKqc3Qo-TB3OGNGoRBGTUJo";
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
  var testingApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=X0SijTp9QmtmfIHB8-dU1wKqKEFl9qFxGxhIhiG1_b0&q=Covid&at=" + cityLatitude + "," + cityLongitude ;
  fetch(testingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      locContainer.innerHTML = "";
      for (var i = 0; i < data.items.length; i++) {
        //add testing center title to locs, add testing address to locs
        var locTitle = document.createElement("span");
        var locContent = document.createElement("div");
        var loc = document.createElement("div");
        var locAddress = document.createElement("a");
        var locBody = document.createElement("div");
        facilitiesHeader.classList.remove("hide");
        //currentCity.classList.remove("hide");
        locBody.classList = "loc-action";
        locAddress.classList = "facility-address modal-trigger";
        locAddress.id = "facility-address";
        locAddress.textContent = data.items[i].address.houseNumber + " " + data.items[i].address.street + ", " + data.items[i].address.county + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
        console.log(locAddress.textContent);
        locAddress.setAttribute("href", "#modal2") ;
        locTitle.classList = "loc-title";
        locTitle.textContent = data.items[i].title.split(":")[1];
        console.log(locTitle.textContent);
        locContent.classList = "loc-content white-text";
        loc.classList = "loc darken-1 row s112 m5 l2";
        
        //console.log(locTitle.textContent);
        //append loc title and address to the page
        locContent.appendChild(locTitle);
        locContent.appendChild(locAddress);
        locBody.appendChild(locContent);
        loc.appendChild(locBody);
        locContainer.appendChild(loc);
        
      }
    });
}
// Set Data for Embedded Map and Navigate Button

$(document).on("click", ".facility-address", function ($c) {
   //console.log($(this).text());
  navBtn.setAttribute("target", "_blank");
  navBtn.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + $(this).text());
  navMap.setAttribute("src", "https://www.google.com/maps/embed/v1/place?&key=AIzaSyAbDIvcfoHMHKqc3Qo-TB3OGNGoRBGTUJo&q=" + $(this).text());
})

$(document).on("click", ".collection-item", function () {
  // console.log($(this).text());
  getCoordinates($(this).text());
  //getResults($(this).text());
});

$(".collection").on("click", "li", function () {
  searchHistory($(this).text());
})

getCntyName();

