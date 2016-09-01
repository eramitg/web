//import $ from 'jquery';

require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");

require("bootstrap-daterangepicker/daterangepicker.css")
require("bootstrap-daterangepicker")
require("bootstrap-toggle/css/bootstrap-toggle.css")
require("bootstrap-toggle")
require("chartist/dist/chartist.min.css")
var Chartist = require("chartist")
require("./assets/custom.css")

var img = $('#logo')[0];
img.src=require("./assets/logo.png")


var Vue = require("vue/dist/vue.js")

require("datatables/media/css/jquery.dataTables.css")
var dt = require("datatables");

$('input[name="daterange"]').daterangepicker();


new Vue({
  el: '#results',
  data: {
    results: '42'
  }
})

var data = {
  labels: ['21.10.2016', '22.10.2016', '23.10.2016', '24.10.2016', '25.10.2016', '26.10.2016', '27.10.2016', '28.10.2016'],
  series: [
    [5, 4, 3, 7, 5, 10, 3, 9],
    [1, 2, 2, 1, 2, 1, 0, 1]
  ]
};

var options = {
  // Don't draw the line chart points
  showPoint: true,
  showArea: true,
  fullWidth: true,
  // Disable line smoothing
  lineSmooth: false,
  // X-Axis specific configuration
  axisX: {
    // We can disable the grid for this axis
    //showGrid: false,
    // and also don't show the label
    showLabel: true
  },
  height: 200
};

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
new Chartist.Line('.ct-chart', data, options);

$(document).ready(function() {
    $('#table').DataTable( {
        "ajax": "data/objects.txt",
        "columns": [
        
            { "data": "name" },
            { "data": "position" },
            { "data": "office" },
            { "data": "extn" },
            { "data": "start_date" },
            { "data": "salary" }
        ]
    } );
} );