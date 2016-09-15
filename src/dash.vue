<template>
<div>

<div class="page-header"><h1>Dashboard</h1></div>


<div class="panel panel-default">
    <div class="panel-heading">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-2">
                    <a href="#">Nr. Results <span class="badge" id="results">{{results}}</span></a>
                </div>
                <div class="col-sm-2">
                    <input checked data-toggle="toggle" type="checkbox" data-on="Sending" data-off="Receiving">
                </div>
                <div class="col-sm-3">
                    <input type="text" name="daterange" class="form-control" value="01/01/2015 - 01/31/2015"/>
                </div>

                <div class="col-sm-2">
                    <!-- Split button -->
                    <div class="btn-group">
                        <button type="button" class="btn btn-default">Filter name...</button>
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="caret"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#">Voigt</a></li>
                            <li><a href="#">Schaer</a></li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>

    </div>
    <div class="panel-body">
        <div ref="chart" class="overview-graph"></div>
    </div>
</div>

<!-- Modal HTML -->

<div id="details-dialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Temperature Details</h4>
            </div>
            <div class="modal-body">
                <div class="detail-graph"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="panel panel-default">
    <div class="panel-body">
        <table id="table" class="display">
        </table>
    </div>
</div>

</div>
</template>

<script>
require('expose?$!expose?jQuery!jquery');
require("bootstrap-daterangepicker/daterangepicker.css")
require("bootstrap-daterangepicker")
require("bootstrap-toggle/css/bootstrap-toggle.css")
require("bootstrap-toggle")
require("chartist/dist/chartist.min.css")
require("datatables/media/css/jquery.dataTables.css")
require("datatables");


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

const options = {
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

var dataDetail = {
  labels: ['21.10.2016', '22.10.2016', '23.10.2016', '24.10.2016', '25.10.2016', '26.10.2016', '27.10.2016', '28.10.2016'],
  series: [
    [24.1, 24.2, 26, 27, 26, 25.2, 25.3, 25.1],
    [26, 26, 26, 26, 26, 26, 26, 26]
  ]
};

var optionsDetail = {
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

import auth from './auth.js'
import ajax from './utils.js'
export default {
    async mounted() {
        var Chartist = require("chartist")
        $('input[name="daterange"]').daterangepicker();
        let results = await this.parcels()
        console.log(results)
        var res = this.process(results)
        this.data = res.data;
        this.results = this.data.labels.length
        console.log(this.data)
        new Chartist.Line(this.$refs.chart, this.data, options)
        let tmp = this.processTable(results)
        this.dataSet = tmp
        $('#table').DataTable( {
                        //"ajax": "data/objects.txt",
                        data: this.dataSet,
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
    },
    data() {
        return {
            results: 42,
            message: '',
            data : '',
            dataSet: ''
        }
    },
    methods: {
        async parcels() {
            let uid = auth.uid();
            return await ajax.ajax({
                type: "GET",
                url: "/api/users/"+uid+"/parcels/web",
                dataType: "json",
                contentType : "application/json",
                headers: auth.authHeader()
            });
        },
        processTable(rawData) {
                    var result = []
                    let len = rawData.length;
                    for (var i = 0; i < len; i++) {
                        result[i] = [];
                        result[i][0]= rawData[i].sender
                        result[i][1]= rawData[i].sender
                        result[i][2]= rawData[i].receiver
                        result[i][3]= rawData[i].receiver
                        result[i][4]= rawData[i].dateSent
                        result[i][5]= '5h'
                        result[i][6]= rawData[i].tntNumber
                        result[i][7]= rawData[i].tempCategory.name
                        result[i][8]= rawData[i].result.isSuccess
                        result[i][9]= rawData[i].measurements
                    }
                    return result;
        },
        process(rawData) {
            var result = {data:{labels:[],series:[[],[]]}}
            let len = rawData.length;
            var index = -1;
            for (var i = 0; i < len; i++) {
                let date = rawData[i].dateSent.split('T')[0];
                if(result.data.labels[index] !== date) {
                    index++;
                    result.data.labels[index] =  date

                }

                if(!result.data.series[0][index]) {
                    result.data.series[0][index] = 0;
                }
                if(!result.data.series[1][index]) {
                    result.data.series[1][index] = 0;
                }

                result.data.series[0][index] ++
                result.data.series[1][index] += rawData[i].result.isSuccess? 1:0
            }
            return result;
        }
    }
}
</script>

<style>
.overview-graph .ct-series-a .ct-line,
.overview-graph .ct-series-a .ct-point {
  stroke: green;
}

.overview-graph .ct-series-a .ct-area {
  fill: green;
}


.overview-graph .ct-series-b .ct-line,
.overview-graph .ct-series-b .ct-point {
  stroke: red;
}


.overview-graph .ct-series-b .ct-area {
  fill: red;
}

.detail-graph .ct-series-a .ct-line,
.detail-graph .ct-series-a .ct-point {
  stroke: blue;
}

.detail-graph .ct-series-a .ct-area {
  fill: blue;
}


.detail-graph .ct-series-b .ct-line,
.detail-graph .ct-series-b .ct-point {
  stroke: green;
}


.detail-graph .ct-series-b .ct-area {
  fill: green;
}
</style>