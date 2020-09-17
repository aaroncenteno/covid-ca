// $(document).ready(function(){
//     $('#modal1').modal();

//     var data = {
//         resource_id: '5b6ab22d-42d4-4049-b068-067aacf4c7b3', // the resource id
//         limit: 5, // get 5 results
//         q: 'jones' // query for 'jones'
//       };
//       $.ajax({
//         url: 'https://data.ca.gov/api/3/action/datastore_search',
//         data: data,
//         dataType: 'jsonp',
//         success: function(data) {
//           alert('Total results found: ' + data.result.total)
//           console.log(data);
//         }
//       });


// });

// var covidCasesApi = "cf11de0d-32c5-451a-bfd1-dd7b1951978a";
// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
//         datasets: [{
//             label: '# of Cases',
//             data: [50, 90, 150, 300, 450, 500, 1000, 1250, 1600, 1900, 2000,],
//             backgroundColor: [
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//                 'rgba(101, 150, 255, 0.2)',
//             ],
//             borderColor: [
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//                 'rgba(45, 101, 255, 1)',
//             ],
//             borderWidth: 1
//         }]
//     },

//     options: {
//         maintainAspectRatio: false,
//         title: {
//             display: true,
//             text: 'COVID-19 Cases',
//             fontSize: 25,
//         },
//         configuration: {
//             maintainAspectRatio: false
//         },
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     }
// });


// $(document).ready(function () {
// // modal was triggered
// $("#task-form-modal").on("show.bs.modal", function() {
//     // clear values
//     $("#modalTaskDescription, #modalDueDate").val("");
//   });

//   // modal is fully visible
//   $("#task-form-modal").on("shown.bs.modal", function() {
//     // highlight textarea
//     $("#modalTaskDescription").trigger("focus");
//   });

//   // save button in modal was clicked
//   $("#task-form-modal .btn-save").click(function() {
//     // get form values
//     var taskText = $("#modalTaskDescription").val();
//     var taskDate = $("#modalDueDate").val();

//     if (taskText && taskDate) {
//       createTask(taskText, taskDate, "toDo");

//       // close modal
//       $("#task-form-modal").modal("hide");

//       // save in tasks array
//       tasks.toDo.push({
//         text: taskText,
//         date: taskDate
//       });

//       saveTasks();
//     }
//   });
// })

//hardcoding testing site API until we have a drop down select menu for city
var getTestSites = function () {
  var testingApiUrl = "https://discover.search.hereapi.com/v1/discover?apikey=POCS-2BFREy-Z7M-QAeIBS6kKAmxVe2jzAg0u8eAMDk&q=Covid&at=30.22,-92.02&limit=5"
  fetch(testingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // adds testing title to card
      var cardTitle = document.createElement("span");
      cardTitle.classList = "card-title";
      cardTitle.textContent = data.items[0].title;
      var cardContent = document.createElement("div");
      cardContent.classList = "card-content white-text";
      cardContent.appendChild(cardTitle);
      var card = document.createElement("div");
      card.classList = "card darken-1";
      card.appendChild(cardContent);
      var cardContainer = document.querySelector(".card-container");
      cardContainer.appendChild(card);
      // adds testing address to card

    })
}

getTestSites();