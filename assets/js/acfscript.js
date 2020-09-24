var cntyAction = document.querySelector(".cnty-action");
var cntyContainer = document.querySelector(".cnty-container");
var cntyList = document.querySelector(".cnty-list");
var cntyList = document.querySelector(".collection");
var currentcnty = document.querySelector(".current-cnty");
var facilitiesHeader = document.querySelector(".facilities-header");
var navBtn = document.querySelector("#navigate-button");
var navContent = document.querySelector(".modal-content");
var navHeader = document.querySelector(".facility-name");
var navMap = document.querySelector("#nav-map");
var testingcnty = document.querySelector("#testingcnty");

// Modals For Map and Error
$(document).ready(function () {
  $('#modal2').modal();
  $('#modal3').modal();
});
  
// Grab County Name and Format for Display
var getCntyName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var cntyName = queryString.split("=")[1];
  
    if (cntyName) {
      // display county name on the page
      testingcnty.textContent=cntyName.replace(/%20/g, " ");
      listFacilities(cntyName);
    } else {
      // if no repo was given, redirect to the homepage
      document.cntyation.replace("./index.html");
    }
};

var listFacilities = function (cntyName) {
  if (cntyName) {
    getCoordinates(cntyName);
  }
}

//FUNCTION to convert cntyName into Long/Lat coordinates
var getCoordinates = function (cntyName) {
  var coordinatesApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cntyName + "county" + "&key=AIzaSyAbDIvcfoHMHKqc3Qo-TB3OGNGoRBGTUJo";
  fetch(coordinatesApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cntyLatitude = data.results[0].geometry.location.lat;
      var cntyLongitude = data.results[0].geometry.location.lng;
      getTestSites(cntyLatitude, cntyLongitude);
    })

}

// Fetch Testing Facilities Using Lat and Lng and Display in List
var getTestSites = function (cntyLatitude, cntyLongitude) {
  var testingApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=X0SijTp9QmtmfIHB8-dU1wKqKEFl9qFxGxhIhiG1_b0&q=Covid&at=" + cntyLatitude + "," + cntyLongitude ;
  fetch(testingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cntyContainer.innerHTML = "";
      for (var i = 0; i < data.items.length; i++) {

        //add testing center title to cntys, add testing address to cntys
        var cntyTitle = document.createElement("span");
        var cntyContent = document.createElement("div");
        var cnty = document.createElement("div");
        var cntyAddress = document.createElement("a");
        var cntyBody = document.createElement("div");
        var cntyEl=document.createElement("div");
        var cntyLat=document.createElement("a");

        

        // Check for House Number, Street to Remove Undefined from Text Content
        if (data.items[i].address.houseNumber) {
          cntyAddress.textContent = " " + data.items[i].address.houseNumber + " " + data.items[i].address.street + ", " + data.items[i].address.city + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
          } else if (data.items[i].address.street) {
            cntyAddress.textContent = " " + data.items[i].address.street + ", " + data.items[i].address.city + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
          } else {
            cntyAddress.textContent = " " + data.items[i].address.city + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
          }
        
        // Set Attribute of List Items
        facilitiesHeader.classList.remove("hide");
        cntyBody.classList = "cnty-action";
        cntyAddress.classList = "facility-address modal-trigger";
        cntyAddress.id = "facility-address";
        cntyAddress.setAttribute("href", "#modal2") ;
        cntyTitle.classList = "cnty-title";
        cntyTitle.textContent = data.items[i].title.split(":")[1];
        cntyContent.classList = "cnty-content white-text";
        cnty.classList = "cnty darken-1 row cnty-item";
        cntyEl.classList = "hide"
        cntyLat.textContent=data.items[i].position.lat + "," + data.items[i].position.lng;
        
        // Append List Items to List and Display
        cntyContent.appendChild(cntyEl);
        cntyEl.appendChild(cntyLat);
        cntyContent.appendChild(cntyTitle);
        cntyContent.appendChild(cntyAddress);
        cntyBody.appendChild(cntyContent);
        cnty.appendChild(cntyBody);
        cntyList.appendChild(cnty);
        cntyContainer.appendChild(cntyList);
      }
    })

    // Set Data for Embedded Map and Navigate Button
    $(document).on("click", ".facility-address", function() {
    var latLng = $(this.parentElement.parentElement.children[0].children[0].innerHTML).text();
    var mapFacility=$(this.parentElement.parentElement.children[0].children[1]).text();

    navHeader.textContent=mapFacility;

    navBtn.setAttribute("target", "_blank");
    navBtn.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + latLng);
    navMap.setAttribute("src", "https://www.google.com/maps/embed/v1/place?q=" + latLng + "&key=AIzaSyAbDIvcfoHMHKqc3Qo-TB3OGNGoRBGTUJo");
    });
}

getCntyName();

