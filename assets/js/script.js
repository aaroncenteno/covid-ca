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

//   var data = {
//     resource_id: 'b6648a0d-ff0a-4111-b80b-febda2ac9e09', // the resource id
//     limit: 5, // get 5 results
//     q: 'jones' // query for 'jones'
//   };
//   $.ajax({
//     url: '',
//     data: data,
//     dataType: 'jsonp',
//     success: function(data) {
//       alert('Total results found: ' + data.result.total)
//     }
//   });
})

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

//hardcoding testing site API until we have a drop down select menu for city
var getTestSites = function () {
  var testingApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=X0SijTp9QmtmfIHB8-dU1wKqKEFl9qFxGxhIhiG1_b0&q=Covid&at=30.22,-92.02&limit=5"
  fetch(testingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      for (var i = 0; i < 5; i++) {
        // add testing title to card
        var cardTitle = document.createElement("span");
        cardTitle.classList = "card-title";
        cardTitle.textContent = data.items[i].title;
        // FIGURE OUT HOW TO DELETE FIRST PART OF STRING IN TITLES: Covid-19 Testing Site:    something like: cardTitle.textContent.split
        var cardContent = document.createElement("div");
        cardContent.classList = "card-content white-text";
        cardContent.appendChild(cardTitle);
        var card = document.createElement("div");
        card.classList = "card darken-1 col s112 m5 l2";
        card.appendChild(cardContent);
        var cardContainer = document.querySelector(".card-container");

        // add testing address to card
        var cardAddress = document.createElement("a");
        cardAddress.classList = "facility-address";
        cardAddress.id = "facility-address";
        cardAddress.textContent = data.items[i].address.houseNumber + " " + data.items[i].address.street + ", " + data.items[i].address.county + ", " + data.items[i].address.state + " " + data.items[i].address.postalCode;
        var cardBody = document.createElement("div");
        cardBody.classList = "card-action";
        cardBody.appendChild(cardAddress);
        card.appendChild(cardBody);
        cardContainer.appendChild(card);
      }
    });
}
var cityCasesEl=document.querySelector(".city-cases");
var cityDeathsEl=document.querySelector(".city-deaths");
var cityHeaderEl=document.querySelector(".city-header");

var getTestResults = function () {
  var resultsApiUrl = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + cityName;
    fetch(resultsApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var i= data.result.records.length - 1;
      cityHeaderEl.textContent =  data.result.records[i].county;
      cityCasesEl.textContent = "Covid Cases: " + data.result.records[i].totalcountconfirmed;
      cityDeathsEl.textContent = "Covid Deaths: " + data.result.records[i].totalcountdeaths;
      
    });
}


