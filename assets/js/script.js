var note = 'new note'
var cardAction = document.querySelector(".card-action");
var cardContainer = document.querySelector(".card-container");
var chartEl = document.querySelector("#chart-container");
var cnties = [];
var cntyCasesEl = document.querySelector(".cnty-cases");
var cntyDeathsEl = document.querySelector(".cnty-deaths");
var cntyHeaderEl = document.querySelector(".cnty-header");
var cntyInputEl = document.querySelector("#cnty-search");
var cntyList = document.querySelector(".collection");
var cntyName = cntyInputEl.value.trim();
var currentcnty = document.querySelector(".current-cnty");
var dataBaseInfo = [];
var deleteButtonEl = document.querySelector("#clear-storage-btn")
var facilitiesHeader = document.querySelector(".facilities-header");
var limitWarningEl = document.querySelector("#limit-warning");
var navBtn = document.querySelector("#navigate-button");
var navContent = document.querySelector(".modal-content");
var navHeader = document.querySelector(".facility-name");
var navMap = document.querySelector("#nav-map");
var searchButtonEl = document.querySelector("#searchbutton");
var instance = M.Modal.getInstance("#modal3");
var apikey = 'f5654ab6-438a-4c58-a1ff-c927dde0f534'
var currentDate = moment().format("L");


var cntyNames = {
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
}

$(document).ready(function () {
  $('#modal1').modal();
  $('#modal2').modal();
  $('#modal3').modal();


  $('input.autocomplete').autocomplete({
    data: cntyNames,
  });

  $("#cnty-search").on("keypress", function (e) {
    if (e.which == 13) {
      var cntyInputEl = $("#cnty-search").val();
      searchButtonHandler(cntyInputEl);
      $("#cnty-search").val("");
      $("#modal1").modal('close');
    }
  });
  
})

//function to grab user's cnty search choice
var searchButtonHandler = function (event) {

  //get search input value
  var cntyName = cntyInputEl.value.trim();
  var splitStr = cntyName.toLowerCase().split(' ');

  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  // Directly return the joined string
  cntyName = splitStr.join(' ');

  //add cntyName to list
  if (cntyNames[cntyName] === null) {

    //reset cntyInput
    $("#cnty-search").val("");
    cardContainer.innerHTML = "";
    chartEl.innerHTML= "";
    appendcnty(cntyName);

    //add to local storage
    savecnty(cntyName);
    getCoordinates(cntyName);
    getResults(cntyName);
  } 

  // Create Chart Element and Append 
  var myChartEl = document.createElement("canvas");
    myChartEl.id = "myChart";
    chartEl.appendChild(myChartEl);
};

// Click on Search History Items and Load to Page
var searchHistory = function (cntyName) {
  
  if (cntyName) {
    cntyInputEl.value = "";
    cardContainer.textContent = "";
    chartEl.innerHTML = "";
    getCoordinates(cntyName);
    getResults(cntyName);
    
  }

  // Create Chart Element and Append
  var myChartEl = document.createElement("canvas");
    myChartEl.id = "myChart";
    chartEl.appendChild(myChartEl);
};

//function to delete county history list
var deleteButtonHandler = function () {
  var cntyItem = $(".collection-item");
  cntyItem.remove();
  cnties = [];
  localStorage.setItem("cnties", JSON.stringify(cnties));
}

//function to add county to list
var appendcnty = function (cntyName) {
  if (cnties.indexOf(cntyName) === -1) {

    //append to list
    var cntyItem = document.createElement("li");
    cntyItem.classList = "collection-item";
    cntyItem.textContent = cntyName;
    cntyList.appendChild(cntyItem);
  }
}

//function to add county to local storage
var savecnty = function (cntyName) {

  //array for old searches
  if (cnties.indexOf(cntyName) === -1) {
    cnties.push(cntyName);
    localStorage.setItem("cnties", JSON.stringify(cnties));
  }
};

//function to load counties from local storage on page refresh
var loadcnty = function () {
  cnties = JSON.parse(localStorage.getItem("cnties"));
  if (cnties === null) {
    cnties = [];
  };
  for (var i = 0; i < cnties.length; i++) {
    var cntyItem = document.createElement("li");
    cntyItem.classList = "collection-item";
    cntyItem.textContent = cnties[i];
    cntyList.appendChild(cntyItem);
  }
}

// fetch and show Covid Case and Deaths for selected County
var getResults = function (cntyName) {
  var resultsApiUrl = "https://data.ca.gov/api/3/action/datastore_search?resource_id=6a1aaf21-2a2c-466b-8738-222aaceaa168&q=" + cntyName +  '&limit=2000';
  fetch(resultsApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var i = data.result.records.length - 1;
      console.log(i)
      dataBaseInfo = data.result.records;
      cntyHeaderEl.textContent = data.result.records[i].area;
      cntyCasesEl.textContent = "Covid Cases: " + data.result.records[i].cumulative_positive_tests;
      cntyDeathsEl.textContent = "Covid Deaths: " + data.result.records[i].cumulative_deaths;

      // Chart Creation
      var ctx = document.getElementById('myChart').getContext('2d');
      var caseData = [];
      var deathData = []
      var date = [];
      var a = moment([2020, 3]);
      var b = moment([moment().get('year'), moment().get('month')]);
      var monthCount = b.diff(a,'months');

      for (j = -1; j <= monthCount; j++) {

        // Initial Date of Covid Case Recording
        var month = moment([2020, 3, 18]).add(j, 'month');
        var lastDay = new Date((moment(month).format('YYYY')), (moment(month).format('MM')), 0);
        for  (i = 0; i < data.result.records.length; i++) {
          var compareDate = moment(lastDay).format("YYYY-MM-DD");
          if (data.result.records[i].date === compareDate)  
          {
          var dateFormat = moment(data.result.records[i].date).format("MMM YYYY");
          date.push(dateFormat);
          caseData.push(dataBaseInfo[i].cumulative_positive_tests);
          deathData.push(dataBaseInfo[i].cumulative_deaths)
          } 
        }  
      }
      console.log(data.result.records[i-1].date)
      if (dataBaseInfo[i-1].date === null) {
        date.push(moment().format('MMM YYYY'));
        caseData.push(dataBaseInfo[i-1].cumulative_positive_tests);
        deathData.push(dataBaseInfo[i-1].cumulative_deaths)
      }
      // var a = data.result.records.length - 1;
      // var dateFormat = moment(data.result.records[a].date).format("MMM");
      // date.push(dateFormat);
      // caseData.push(dataBaseInfo[a].totalcountconfirmed);
      var myChart = new Chart(ctx, {
        // Chart Styling
        type: 'line',
        data: {
          labels: date,
          datasets: [
            {
            label: '# of Cases',
            data: caseData,
            backgroundColor:
              'rgba(128, 203, 196, 0.4)',
            borderColor:
              'rgba(0, 96, 100, 1)',
            borderWidth: 1,
          },
          {
            label: '# of Deaths',
            data: deathData,
            backgroundColor:
              'rgba(0, 0, 0, 1`)',
            borderColor:
              'rgba(0, 96, 100, 1)',
            borderWidth: 1,
          }
        ]
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
  });
}

//FUNCTION to convert cntyName into Long/Lat coordinates
var getCoordinates = function (cntyName) {
  var coordinatesApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cntyName + "county" + "&key=AIzaSyBgh53SP0qCh3x-Y-ziDwxnyTeVyWTx6aI";
  fetch(coordinatesApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      var cntyLatitude = data.results[0].geometry.location.lat;
      var cntyLongitude = data.results[0].geometry.location.lng;
      getTestSites(cntyLatitude, cntyLongitude, cntyName);
    })
};


//Function to fetch test sites using lat and lng; Create Testing Facilities Cards
var getTestSites = function (cntyLatitude, cntyLongitude, cntyName) {
  var testingApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=X0SijTp9QmtmfIHB8-dU1wKqKEFl9qFxGxhIhiG1_b0&q=Covid&at=" + cntyLatitude + "," + cntyLongitude + "&limit=5";
  fetch(testingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cardContainer.innerHTML = "";
      for (var i = 0; i < 5; i++) {

        //add testing center title to cards, add testing address to cards
        var cardTitle = document.createElement("span");
        var cardContent = document.createElement("div");
        var card = document.createElement("div");
        var cardAddress = document.createElement("a");   
        var cardBody = document.createElement("div");
        var cardEl=document.createElement("div");
        var cardLat=document.createElement("a");

        // Handles Undefined House Numbers and Streets by Removing from Text Content
        if (data.items[i].address.houseNumber) {
        cardAddress.textContent = data.items[i].address.houseNumber + " " + data.items[i].address.street + ", " + data.items[i].address.city + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
        } else if (data.items[i].address.street) {
          cardAddress.textContent = data.items[i].address.street + ", " + data.items[i].address.city + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
        } else {
          cardAddress.textContent = data.items[i].address.city + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
        }

        // Continue Attributes of Card
        facilitiesHeader.classList.remove("hide");
        currentcnty.classList.remove("hide");
        cardBody.classList = "card-action";
        cardAddress.classList = "facility-address modal-trigger";
        cardAddress.id = "facility-address";
        // Places Hidden Lat and Lng For Later Consumption in the Modal
        cardEl.classList = "hide";
        cardLat.textContent=data.items[i].position.lat + "," + data.items[i].position.lng;
        cardAddress.setAttribute("href", "#modal2");
        cardTitle.classList = "card-title";
        cardTitle.textContent = data.items[i].title.split(":")[1];
        cardContent.classList = "card-content white-text";
        card.classList = "card darken-1 col s12 m4 offset-m1 l2";

        // Append to Display Created Card
        cardContent.appendChild(cardEl);
        cardEl.appendChild(cardLat);
        cardContent.appendChild(cardTitle);
        card.appendChild(cardContent);
        cardBody.appendChild(cardAddress);
        card.appendChild(cardBody);
        cardContainer.appendChild(card);
      };
    })
    // Load Link Container to Show All Facilities
    .then(function () {
      var limitText = document.createElement("p");
      var linkEl = document.createElement("a");

      // add text to warning container
      limitWarningEl.innerHTML = "";
      limitWarningEl.classList.remove("hide");
      limitText.textContent = "To see all " + cntyName + " County testing facilities, click ";
      limitText.classList =  "limit-text";
      linkEl.textContent = "here";
      linkEl.setAttribute("href", "all_county_facilities.html?&cntyName=" + [cntyName]);
      
      // append to warning container
      limitText.appendChild(linkEl);
      limitWarningEl.appendChild(limitText);
   })

    // Set Data for Embedded Map and Navigate Button
    $(document).on("click", ".facility-address", function() {
    var latLng = $(this.parentElement.parentElement.children[0].children[0].innerHTML).text();
    var mapFacility = $(this.parentElement.parentElement.children[0].children[1]).text();
    
    // To Display Facility In Modal
    navHeader.textContent = mapFacility;

    // Set Attributes of Buttons and Map
    navBtn.setAttribute("target", "_blank");
    navBtn.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + latLng);
    navMap.setAttribute("src", "https://www.google.com/maps/embed/v1/place?q=" + latLng + "&key=AIzaSyAbDIvcfoHMHKqc3Qo-TB3OGNGoRBGTUJo");
    });
}

// On Click History Load County to Page
$(document).on("click", ".collection-item", function () {
  searchHistory($(this).text());
});

// Search Button and Delete Button Even Listener
searchButtonEl.addEventListener("click", searchButtonHandler);
deleteButtonEl.addEventListener("click", deleteButtonHandler);
loadcnty();
