$(document).ready(function () {
  $('#modal1').modal();
  
  $('input.autocomplete').autocomplete({
    data: {
      "Apple": null,
      "Microsoft": null,
      "Google": 'https://placehold.it/250x250'
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

