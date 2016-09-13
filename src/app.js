require('expose?$!expose?jQuery!jquery');

require("bootstrap-webpack");
//import 'bootstrap-webpack'

require("bootstrap-daterangepicker/daterangepicker.css")
require("bootstrap-daterangepicker")
require("bootstrap-toggle/css/bootstrap-toggle.css")
require("bootstrap-toggle")
require("chartist/dist/chartist.min.css")
var Chartist = require("chartist")
require("./assets/custom.css")

var img = $('#logo')[0];
img.src=require("./assets/logo.png")

var i18 = require("i18next/i18next.js")


i18.init({
  debug: 'false',
  lng: 'de',
  fallbackLng: 'de',
  keySeparator: false,
  nsSeparator: false,
  saveMissing: true,
  resources: {
    'de':{ 'translation':require("./assets/locales/de/translation.json")},
    'en':{ 'translation':require("./assets/locales/en/translation.json")}
    }
});

require("datatables/media/css/jquery.dataTables.css")
var dt = require("datatables");
$('input[name="daterange"]').daterangepicker();



import Vue from 'vue/dist/vue.js'
import Login from './login.vue'
import Create from './create.vue'
Vue.component('login', Login)
Vue.component('create', Create)

var v1 = new Vue({el: '#login'})
var v1 = new Vue({el: '#create'})



import auth from './auth.js'

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
new Chartist.Line('.overview-graph', data, options);


var data2 = {
  labels: ['21.10.2016', '22.10.2016', '23.10.2016', '24.10.2016', '25.10.2016', '26.10.2016', '27.10.2016', '28.10.2016'],
  series: [
    [24.1, 24.2, 26, 27, 26, 25.2, 25.3, 25.1],
    [26, 26, 26, 26, 26, 26, 26, 26]
  ]
};

var options2 = {
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
  height: 400,
  width: 600
};

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
new Chartist.Line('.detail-graph', data2, options2);



var dataSet = [
    [ "Voigt", "Tom", "Schaer", "Malik", "21.6.2016 - 22.6.2016", "24h", "TnT 1234", "15-25",  "Ok", "link" ],
    [ "Schaer", "Malik", "Voigt", "Tom", "22.6.2016 - ", "34h...", "TnT 4321", "5-30", "Sent", "link" ]
];



//<th>Date Sent</th>
//                <th>Date Received</th>
//                <th>Sender/Recipient</th>
//                <th>TnT</th>
//                <th>Temp category</th>
//                <th>Status</th>



$(document).ready(function() {
    $('#table').DataTable( {
        //"ajax": "data/objects.txt",
        data: dataSet,
        "columns": [
            { "title": i18.t('send_comp') },
            { "title": i18.t('send_user') },
            { "title": i18.t('rcv_comp') },
            { "title": i18.t('rcv_user') },
            { "title": i18.t('date') },
            { "title": i18.t('transit') },
            { "title": i18.t('tnt') },
            { "title": i18.t('cat') },
            { "title": i18.t('status') },
            { "title": i18.t('details'),
              "render": function ( data, type, full, meta ) {
                return '<button type="button" id="btn" data-toggle="modal" data-loading-text="Loading..." class="btn btn-default" autocomplete="off">'+i18.t('show')+'</button>';
              }
            }
        ],
        "initComplete": function(settings, json) {
            $(".btn1").click(function(){
                $("#details-dialog").modal('show');
            });
        }
    } );

    /*var token = localStorage.getItem("token");
    if(token) {
        $("#user-menu").show();
        $("#login").hide();
    } else {
        $("#user-menu").hide();
        $("#login").show();
    }*/
} );

