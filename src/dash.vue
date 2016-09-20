<template>
<div>

<div class="page-header"><h1>Dashboard</h1></div>


<div class="panel panel-default">
    <div class="panel-heading">
        <div class="container-fluid">
            <div class="row">
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
                <div ref="chart2" class="overview-graph"></div>
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
var moment = require("moment/min/moment-with-locales.js")
var locale = window.navigator.userLanguage || window.navigator.language; //returns e.g. en-US
moment.locale(locale)
require("chartist/dist/chartist.min.css")
require("datatables/media/css/jquery.dataTables.css")
require("datatables.net");
require("datatables.net-colreorder");

var i18 = require("i18next/i18next.js")
i18.init({
  debug: 'false',
  lng: locale,
  fallbackLng: 'en',
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

var Chartist = require("chartist")

import auth from './auth.js'
import ajax from './utils.js'
export default {
    async mounted() {

        var start = moment().subtract(3, 'month');
        var end = moment();
        $('input[name="daterange"]').daterangepicker({
          startDate: start,
          endDate: end,
          ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
             }
          },
            (start, end, label) => {
                this.dataSet = this.processTable(this.results, start, end)
                this.data = this.process(this.results, start, end).data
            }
        );

        this.results = await this.parcels()
        this.data = this.process(this.results).data
        console.log(this.data)
        this.chart = new Chartist.Line(this.$refs.chart, this.data, options)
        this.chartDetail = new Chartist.Line(this.$refs.chart2, [], optionsDetail)
        this.dataSet = this.processTable(this.results, start, end)
        this.table = $('#table').DataTable( {
                        //"ajax": "data/objects.txt",
                        data: this.dataSet,
                        colReorder: true,
                        "columns": [
                            { "title": i18.t('send_comp'),
                              "render": function ( data, type, full, meta ) {
                                return data ? data:"-"
                              }
                            },
                            { "title": i18.t('send_user'),
                              "render": function ( data, type, full, meta ) {
                                return data? data:"-"
                              }
                            },
                            { "title": i18.t('rcv_comp'),
                              "render": function ( data, type, full, meta ) {
                                 return data? data:"-"
                              }
                            },
                            { "title": i18.t('rcv_user'),
                              "render": function ( data, type, full, meta ) {
                                return data? data:"-"
                              }
                            },
                            { "title": i18.t('date_sent'),
                              "render": function ( data, type, full, meta ) {
                                let date = moment(data)
                                if(date.valueOf() <= 0 ) return "n/a"
                                return date.format('DD.MM.YYYY, HH:mm')
                              }
                            },
                            { "title": i18.t('date_received'),
                              "render": function ( data, type, full, meta ) {
                                let date = moment(data)
                                if(date.valueOf() <= 0 ) return "n/a"
                                return moment(data).format('DD.MM.YYYY, HH:mm')
                              }
                            },
                            { "title": i18.t('transit'),
                              "render": function ( data, type, full, meta ) {
                                let a = moment(full[5])
                                let b = moment(full[4])
                                let diff = a.diff(b, 'hours', true)
                                if(diff < 0) return "n/a";
                                return a.diff(b, 'hours', true).toFixed(1)+'h'
                              }
                            },
                            { "title": i18.t('tnt') },{ "title": i18.t('cat') }, { "title": i18.t('status'),
                              "render": function ( data, type, full, meta ) {
                                if(data < 0) {
                                  return i18.t('status_transit')
                                }
                                return data === 0 ?i18.t('status_ok') : i18.t('status_bad')
                              }

                            },
                            { "title": i18.t('details'),
                              "render": function ( data, type, full, meta ) {

                                //console.log(meta.row)
                                return '<button type="button" id="btn" data-toggle="modal" data-loading-text="Loading..." class="btn btn-default" autocomplete="off">'+i18.t('show')+'</button>';
                              }
                            }
                        ],
                        "drawCallback": function (settings) {
                            var api = this.api();
                            console.log(api.colReorder.transpose( 0 ))
                        }
                    } );

             var tmp = this.table
             var that = this
             $('#table tbody').on( 'click', 'button', async function() {
                let row = tmp.row( $(this).parents('tr') )
                let pid = row.data()[12]
                console.log(pid)
                var res = await that.parcelDetails(pid);
                console.log(res)
                //this.dataDetail = this.processDetail(res[index])
             } );
    },
    data() {
        return {
            results: '',
            message: '',
            data : '',
            dataSet: '',
            dataDetail: '',
            table: '',
            chart: '',
            chartDetail: ''
        }
    },
    watch: {
      'dataSet' : function (val, oldVal) {
         this.table.clear()
         if(val.length > 0) {
           this.table.rows.add(val)
         }
         this.table.draw()
      },
      'data' : function (val, oldVal) {
         console.log(val)
         this.chart.update(val)
      },
      'dataDetail' : function (val, oldVal) {
         console.log(val)
         this.chartDetail.update(val)
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
        async parcelDetails(pid) {
            let uid = auth.uid();
            return await ajax.ajax({
                type: "GET",
                url: "/api/users/"+uid+"/parcels/details/"+pid,
                dataType: "json",
                contentType : "application/json",
                headers: auth.authHeader()
            });
        },
        processTable(rawData, start, end) {
                    var result = []
                    let len = rawData.length;
                    for (var i = 0, index = 0; i < len; i++) {
                        if(start && moment(rawData[i].dateSent).isBefore(start) && moment(rawData[i].dateReceived).isBefore(start)) {
                          continue;
                        }
                        if(end && moment(rawData[i].dateSent).isAfter(end) && moment(rawData[i].dateReceived).isAfter(end)) {
                          continue;
                        }
                        result[index] = [];
                        result[index][0]= rawData[i].sender
                        result[index][1]= rawData[i].sender
                        result[index][2]= rawData[i].receiver
                        result[index][3]= rawData[i].receiver
                        result[index][4]= moment(rawData[i].dateSent).valueOf()
                        result[index][5]= moment(rawData[i].dateReceived).valueOf()
                        result[index][6]= 'n/a'
                        result[index][7]= rawData[i].tntNumber
                        result[index][8]= rawData[i].tempCategory.name
                        //-1 means not finished yet
                        result[index][9]= (!rawData[i].result.isFailed && !rawData[i].result.isSuccess) ? -1 : rawData[i].result.nrFailures
                        result[index][10]= rawData[i].measurements
                        result[index][11]=i
                        result[index][12]=rawData[i].id
                        index++
                    }
                    console.log("processed: "+result)
                    return result;
        },
        process(rawData, start, end) {
            var result = {data:{labels:[],series:[[],[]]}}
            let len = rawData.length;
            for (var i = 0, index = -1; i < len; i++) {
                if(start && moment(rawData[i].dateSent).isBefore(start)) {
                  continue;
                }
                if(end && moment(rawData[i].dateSent).isAfter(end)) {
                  continue;
                }


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
                result.data.series[1][index] += rawData[i].result.nrFailures > 0 ? 1:0
            }
            return result;
        },
        processDetail(rawData) {
         console.log("raw data: " + JSON.stringify(rawData))
         return [];
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