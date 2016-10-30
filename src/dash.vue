<template>
    <div>
        <div class="row" v-if="!authenticated">
            <div class="col-sm-12">
                <p class="text-center">Keine Informationen verfügbar. Bitte loggen Sie sich ein.</p>
            </div>
        </div>
        <div v-if="authenticated" class="row tile_count">
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Total Sendungen verschickt</span>
                <div class="count">{{total}}</div>
                <div class="count"></div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Total Sendungen OK</span>
                <div class="count green">{{total_ok}}</div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Anzahl Abweichungen</span>
                <div class="count orange">{{total_out_spec}}</div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top"># Sendungen unterwegs</span>
                <div class="count">{{total_not_arrived}}</div>
            </div>
        </div>
        <div v-if="authenticated" class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="dashboard_graph x_panel">
                    <div class="row x_title">
                        <div class="col-sm-4 col-xs-12">
                            <input type="text" name="daterange" class="form-control" />
                        </div>
                        <div class="col-sm-2 col-xs-12">
                            <input name="checkbox" class="dropdown-toggle" checked data-toggle="toggle" type="checkbox"
                                   data-on="Sender"
                                   data-off="Empfänger">
                        </div>
                        <div class="col-sm-2 col-xs-12">
                            <div class="btn-group">
                                <select class="form-control" v-model="selected">
                                    <option v-if="sending" v-for="recipientCompany in recipientCompanies"
                                            @click="filter()">{{ recipientCompany }}
                                    </option>
                                    <option v-if="!sending" v-for="senderCompany in senderCompanies"
                                            @click="filter()">{{ senderCompany }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-9 col-xs-12">
                        <div ref="chart" class="overview-graph"></div>
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-12">
                        <div ref="chartPie" class=""></div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
        <div v-if="authenticated" class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_content">
                        <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="table">
                                        <table id="table"
                                               class="table dataTable table-responsive no-footer"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal HTML -->
        <div id="details-dialog" class="modal fade">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header no-print">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">Details</h4>
                    </div>
                    <div class="modal-body row">
                        <div class="col-sm-9">
                            <div class="x_panel">
                                <div class="x_title">
                                    <h5>{{ titleDetailsDialog }}</h5>
                                </div>
                                <div class="x_content">
                                    <!--<div ref="chart2" class="overview-graph"></div>-->
                                    <canvas id="chartDetail2"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="x_panel">
                                <div class="x_title">
                                    <h5>Infos</h5>
                                </div>
                                <div>
                                    <dd>Track and Trace</dd>
                                    <dl>{{parcelDetails.tntNumber}}</dl>

                                    <dd>Sender</dd>
                                    <dl>{{parcelDetails.sender}} / {{parcelDetails.senderCompany}}</dl>

                                    <dd>Receiver</dd>
                                    <dl>{{parcelDetails.receiver}} / {{parcelDetails.receiverCompany}}</dl>

                                    <dd>Date Sent</dd>
                                    <dl>{{parcelDetails.dateSent | dateFormatFull}}</dl>

                                    <dd>Date Received</dd>
                                    <dl>{{parcelDetails.dateReceived | dateFormatFull}}</dl>

                                    <dd>Status</dd>
                                    <dl>{{statusDetails}}</dl>

                                    <dd>Temperature Category</dd>
                                    <dl>{{tempCategory}}</dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer no-print">
                        <button class="btn btn-default" @click="print()"><i class="fa fa-print" aria-hidden="true"></i></button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
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
    require("./assets/css/jquery.dataTables-modum.css")
    require("datatables.net");
    require("datatables.net-colreorder");
    require("jQuery.print/jQuery.print.js");
    require("chart.js");
    require("Chart.Zoom.js");

    var i18 = require("i18next/i18next.js")
    i18.init({
        debug: 'false',
        lng: locale,
        fallbackLng: 'en',
        keySeparator: false,
        nsSeparator: false,
        saveMissing: true,
        resources: {
            'de': {'translation': require("./assets/locales/de/translation.json")},
            'en': {'translation': require("./assets/locales/en/translation.json")}
        }
    });

    const options = {
        // Don't draw the line chart points
        showPoint: true,
        showArea: true,
        fullWidth: true,
        seriesBarDistance: 0,
        axisX: {
            // We can disable the grid for this axis
            //showGrid: false,
            // and also don't show the label
            showLabel: true
            //labelInterpolationFnc: function skipLabels(value, index, labels) {
            //    return index % Math.round(labels.length / 15) === 0 ? value : null;
            //},
            ,
            ticks: {
                maxRotation: 90,
                minRotation: 90
            },
        },
        chartPadding: {
            top: 15,
            right: 15,
            bottom: 30,
            left: 10
        },
        height: 200
    };

    var optionsDetail2 = {
        scales: {
            yAxes: [{
                ticks: {
                    max: 40,
                    min: 0,
                    fixedStepSize: 3
                },
                scaleLabel: {
                    display: true,
                    labelString: '°C'
                }
            }],
        },
        legend: {
            display: false
        },
        horizontalLine: [{
            y: 25,
            style: "#FFA100",
        }, {
            y: 15,
            style: "#25A9E1",
        }],
        pan: {
            // Boolean to enable panning
            enabled: true,

            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy'
        },

        // Container for zoom options
        zoom: {
            // Boolean to enable zooming
            enabled: true,

            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'xy'
        }
    };

    var Chartist = require("chartist")

    import auth from './auth.js'
    import utils from './utils.js'
    export default {
        updated() {
            $(function () {
                $('input[name="checkbox"]').bootstrapToggle();
            })
        },
        async mounted() {
            var that = this
            this.start = moment().subtract(3, 'month');
            this.end = moment();
            $('input[name="daterange"]').daterangepicker({
                        startDate: that.start,
                        endDate: that.end,
                        ranges: {
                            'Today': [moment(), moment()],
                            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        }
                    }, (start, end, label) => {
                        this.start = start
                        this.end = end
                        this.updateTable()
                        this.updateChart()
                        console.log("change")
                    }
            );
            $('input[name="checkbox"]').change(function () {

                if ($(this).prop('checked')) {
                    that.sending = true
                } else {
                    that.sending = false
                }
                that.updateTable()
                that.updateChart()
            });


            this.results = await this.parcels();

            var canvas = document.getElementById("chartDetail2");
            var ctx = canvas.getContext("2d");

            var horizonalLinePlugin = {
                beforeDraw: function(chartInstance) {
                    var yScale = chartInstance.scales["y-axis-0"];
                    var canvas = chartInstance.chart;
                    var ctx = canvas.ctx;
                    var index;
                    var line;
                    var style;

                    if (chartInstance.options.horizontalLine) {
                        for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
                            line = chartInstance.options.horizontalLine[index];

                            if (!line.style) {
                                style = "rgba(169,169,169, .6)";
                            } else {
                                style = line.style;
                            }

                            var yValue = '';
                            if (line.y) {
                                yValue = yScale.getPixelForValue(line.y);
                            } else {
                                yValue = 0;
                            }

                            ctx.lineWidth = 3;

                            if (yValue) {
                                ctx.beginPath();
                                ctx.moveTo(0, yValue);
                                ctx.lineTo(canvas.width, yValue);
                                ctx.strokeStyle = style;
                                ctx.stroke();
                            }
                        }
                        return;
                    };
                }
            };
            Chart.pluginService.register(horizonalLinePlugin);

            this.chartDetail2 = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: optionsDetail2
            });

            this.updateChart();
            console.log(this.data)
            this.senderCompanies = this.processSenderNames(this.results)
            this.recipientCompanies = this.processRecipientNames(this.results)
            this.chart = new Chartist.Bar(this.$refs.chart, this.data, options)


            this.dataPie = {
                series: [
                    {value: this.total_ok, name: "Sendungen Ok", className: "piechart-ok"},
                    {value: this.total_out_spec, name: "Out of Specification", className: "piechart-outspec"},
                    {value: this.total_not_arrived, name: "Nicht Angekommen", className: "piechart-notarrived"}],
            };

           // var sum = function(a, b) { console.log("value2 "+a); console.log(a.value); return a.value + b.value; };

            this.chartPie =new Chartist.Pie(this.$refs.chartPie, this.dataPie, {
                labelInterpolationFnc: (value, index) => {

                    var res = Math.round((value * 100) / (this.total_ok + this.total_out_spec + this.total_not_arrived)) + '% ';
                    //res += this.dataPie.series[index].name;
                    return res
                },
                donut: true,
                showLabel: true,
                donutWidth: '40%',
                height: 200
            });

            this.updateTable();
            this.updatePie();
            this.table = $('#table').DataTable({
                responsive: true,
                language: {
                    zeroRecords: i18.t('zero_records')
                },
                data: this.dataSet,
                colReorder: true,
                "columns": [
                    {"title": i18.t('tnt')},
                    {
                        "title": i18.t('send_comp'),
                        "render": function (data, type, full, meta) {
                            return data ? data : "-"
                        }
                    },
                    {
                        "title": i18.t('rcv_comp'),
                        "render": function (data, type, full, meta) {
                            return data ? data : "-"
                        }
                    },
                    {
                        "title": i18.t('date_sent'),
                        "render": function (data, type, full, meta) {
                            if (type === 'display' || type === 'filter') {
                                let date = moment(data)
                                if (date.valueOf() <= 0) return "n/a"
                                return date.format('DD.MM.YYYY, HH:mm')
                            } else {
                                return data;
                            }
                        }
                    },
                    {
                        "title": i18.t('date_received'),
                        "render": function (data, type, full, meta) {
                            if (type === 'display' || type === 'filter') {
                                let date = moment(data)
                                if (date.valueOf() <= 0) return "n/a"
                                return date.format('DD.MM.YYYY, HH:mm')
                            } else {
                                return data;
                            }
                        }
                    },
                    {
                        "title": i18.t('transit'),
                        "render": function (data, type, full, meta) {
                            let a = moment(full[4])
                            let b = moment(full[3])
                            let diff = a.diff(b, 'hours', true)
                            if (diff < 0) return "n/a";
                            return a.diff(b, 'hours', true).toFixed(1) + 'h'
                        }
                    },
                    {
                        "title": i18.t('status'),
                        "render": function (data, type, full, meta) {
                            if (data < 0) {
                                return i18.t('status_transit')
                            }
                            var statusIcon = data === 0 ? 'fa fa-check green' : 'fa fa-times orange';
                            var statusText = data === 0 ? i18.t('status_ok') : i18.t('status_bad');
                            return '<i class="' + statusIcon + '"></i> ';
                        }

                    },
                    {
                        "title": i18.t('details'),
                        "render": function (data, type, full, meta) {

                            //console.log(meta.row)
                            return '<button type="button" id="btn" data-toggle="modal" data-target="#details-dialog" data-loading-text="Loading..." class="btn btn-default" autocomplete="off">' + i18.t('show') + '</button>';
                        }
                    }
                ]
            });

            var tmp = this.table
            $('#table tbody').on('click', 'button', async function () {
                let row = tmp.row($(this).parents('tr'))
                let pid = row.data()[7].pid

                var res = await that.getParcelDetails(pid);
                console.log("res");
                console.log(res);
                that.dataDetail2 = that.processDetail2(res).data;
                that.chartDetail2.data.labels = that.dataDetail2.labels;
                that.chartDetail2.data.datasets = that.dataDetail2.datasets;

                that.parcelDetails = {
                    tntNumber: row.data()[0],
                    sender: row.data()[7].sender,
                    senderCompany: row.data()[1],
                    receiver: row.data()[7].receiver,
                    receiverCompany: row.data()[2],
                    dateSent: row.data()[3],
                    dateReceived: row.data()[4]
                }
                that.tempCategory = row.data()[7].tempCategory

                let data = row.data()[6]
                if (data < 0) {
                    that.statusDetails = i18.t('status_transit')
                } else {
                    var statusText = data === 0 ? i18.t('status_ok') : i18.t('status_bad');
                    that.statusDetails = statusText;
                }

                console.log(row.data()[7].maxTemp)

                that.chartDetail2.options.horizontalLine[0].y = row.data()[7].maxTemp;
                that.chartDetail2.options.horizontalLine[1].y = row.data()[7].minTemp;
                that.chartDetail2.update();

                $('#details-dialog').modal('show');
            });
        },
        data() {
            return {
                selected: '',
                start: '',
                end: '',
                results: '',
                message: '',
                data: '',
                dataSet: '',
                dataPie: null,
                dataDetail2: '',
                table: '',
                chart: '',
                chartDetail: '',
                chartPie: null,
                chartDetail2: '',
                titleDetailsDialog: i18.t('temperature_measurements'),
                sending: true,
                //senderNames: '',
                //recipientNames: '',
                senderCompanies: null,
                recipientCompanies: null,
                senderCompany: null,
                recipientCompany: null,
                authenticated: auth.token() != null,
                totalNrSent: '',
                totalNrTransit: '',
                totalNrOK: '',
                totalNrOfFailures: '',
                total: 0,
                total_ok: 0,
                total_not_arrived: 0,
                total_out_spec: 0,
                parcelDetails: '',
                tempCategory: '',
                statusDetails: ''
            }
        },
        filters: {
            dateFormatFull: function (value) {
                return moment(value).format('DD.MM.YYYY, HH:mm')
            }
        },
        watch: {
            'dataSet': function (val, oldVal) {
                console.log("dataSet")
                console.log(val)
                if (this.table) {
                    this.table.clear()
                    if (val.length > 0) {
                        this.table.rows.add(val)
                    }
                    this.table.draw()
                }
            },
            'data': function (val, oldVal) {
                console.log("data")
                console.log(val)
                if (this.chart) {
                    this.chart.update(val)
                }
                this.total = this.dataSet.length
            },
            'dataPie': function (val, oldVal) {
                console.log("data")
                console.log(val)
                if (this.chartPie) {
                    this.chartPie.update(val)
                }
                this.total = this.dataSet.length
            },
            'dataDetail': function (val, oldVal) {
                console.log("dataDetail")
                console.log(val)
                this.chartDetail.update(val)
            },
            'dataDetail2': function (val, oldVal) {
                console.log("dataDetail2")
                console.log(val)
            },
            'start': function (val, oldVal) {
                this.updateTable();
                this.updateChart();
            },
            'end': function (val, oldVal) {
                this.updateTable();
                this.updateChart();
            },
            'sending': function (val, oldVal) {
                this.updateTable();
                this.updateChart();
            },
            'selected': function (val, oldVal) {
                console.log("send company changed: "+val)
                this.updateTable();
                this.updateChart();
            },
            'total_ok': function (val, oldVal) {
                this.updatePie();
            },
            'total_out_spec': function (val, oldVal) {
                this.updatePie();
            },
            'total_not_arrived': function (val, oldVal) {
                this.updatePie();
            }
        },
        methods: {
            updateTable () {
                this.dataSet = this.processTable(this.results, this.start, this.end, this.sending, this.selected)
            },
            updateChart () {
                this.data = this.process(this.results, this.start, this.end, this.sending, this.selected).data
            },
            updatePie () {
                this.dataPie = {
                    series: [
                        {value: this.total_ok, name: "Sendungen Ok", className: "piechart-ok"},
                        {value: this.total_out_spec, name: "Out of Specification", className: "piechart-outspec"},
                        {value: this.total_not_arrived, name: "Nicht Angekommen", className: "piechart-notarrived"}],
                }
            },
            async parcels() {
                return await utils.ajax({
                    type: "GET",
                    url: "/api/v2/parcels/web",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async getParcelDetails(pid) {
                return await utils.ajax({
                    type: "GET",
                    url: "/api/v2/parcels/details/" + pid,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            processTable(rawData, start, end, sending, selectedCompany) {
                var result = []
                let len = rawData.length;

                var tmp = []
                for (var i = 0; i < len; i++) {
                    tmp.push(rawData[i]);
                }
                tmp.sort(function(a, b) {
                    return sending ? moment(a.dateSent).isAfter(moment(b.dateSent)) : moment(a.dateReceived).isAfter(moment(b.dateReceived))
                });
                rawData = tmp

                let isSuperuser = auth.role() === 'SUPER';
                console.log(rawData)
                for (var i = 0, index = 0; i < len; i++) {
                    //console.log(rawData[i].id + "/" + i);
                    //console.log("adding1 id:"+rawData[i].id+ " / "+index)
                    if (start && moment(rawData[i].dateSent).isBefore(start)) {
                        console.log("before")
                        continue;
                    }
                    if (end && moment(rawData[i].dateSent).isAfter(end)) {
                        console.log("after")
                        continue;
                    }
                    if (sending && (rawData[i].senderCompany !== auth.companyName() && !isSuperuser)) {
                        console.log("not sender: " + rawData[i].senderCompany +"/"+auth.companyName() + "su: "+ isSuperuser)
                        continue;
                    }
                    if (!sending && (rawData[i].receiverCompany !== auth.companyName()) && !isSuperuser) {
                        console.log("not receiver")
                        continue;
                    }
                    if (!sending && selectedCompany && selectedCompany !== '-' && (selectedCompany !== rawData[i].receiverCompany)) {
                        console.log("not receiver selected / " + selectedCompany)
                        continue;
                    }
                    if (sending && selectedCompany && selectedCompany !== '-' && (selectedCompany !== rawData[i].senderCompany)) {
                        console.log("not sender selected")
                        continue;
                    }

                    result[index] = [];
                    result[index][0] = rawData[i].tntNumber
                    result[index][1] = rawData[i].senderCompany
                    result[index][2] = rawData[i].receiverCompany
                    result[index][3]= moment(rawData[i].dateSent).valueOf()
                    result[index][4]= moment(rawData[i].dateReceived).valueOf()
                    result[index][5] = 'n/a'
                    //-1 means not finished yet
                    result[index][6] = (!rawData[i].isFailed && !rawData[i].isSuccess) ? -1 : rawData[i].nrFailures;
                    result[index][7] = {
                        nrFailures: rawData[i].nrFailures,
                        nrMeasurements: rawData[i].nrMeasurements,
                        maxTemp: rawData[i].maxTemp,
                        minTemp: rawData[i].minTemp,
                        tableId: i,
                        pid:rawData[i].id,
                        tempCategory:rawData[i].tempCategory,
                        sender: rawData[i].sender,
                        receiver: rawData[i].receiver
                    }

                    index++
                }
                console.log("processed: " + result.length)
                return result;
            },

            print() {
                this.replaceDetailChartCanvas();
                $.print('#details-dialog', {timeout: 750});
            },

            replaceDetailChartCanvas() {
                var image = new Image();
                image.src = $('#chartDetail2').get(0).toDataURL('image/png');
                image.id = 'chartDetail2';
                image.onmouseover = this.replaceDetailChartImage;
                $('#chartDetail2').replaceWith(image);
            },

            replaceDetailChartImage() {
                // Replace the image with a canvas
                var canvas = $('<canvas>').attr('id', 'chartDetail2');
                $("#chartDetail2").replaceWith(canvas);
                var canvas = document.getElementById('chartDetail2');
                var ctx = canvas.getContext("2d");
                this.chartDetail2 = new Chart(ctx, {
                    type: 'line',
                    data: this.dataDetail2,
                    options: optionsDetail2
                });
                this.chartDetail2.update();
            },

            printElement(elem, append, delimiter) {
                var domClone = elem.cloneNode(true);

                var $printSection = document.getElementById("printSection");

                if (!$printSection) {
                    $printSection = document.createElement("div");
                    $printSection.id = "printSection";
                    document.body.appendChild($printSection);
                }

                if (append !== true) {
                    $printSection.innerHTML = "";
                }

                else if (append === true) {
                    if (typeof (delimiter) === "string") {
                        $printSection.innerHTML += delimiter;
                    }
                    else if (typeof (delimiter) === "object") {
                        $printSection.appendChlid(delimiter);
                    }
                }
                $printSection.appendChild(domClone);
            },

            process(rawData, start, end, sending, selectedCompany) {
                this.total_ok = 0;
                this.total_out_spec = 0;
                this.total_not_arrived = 0;
                var result = {data: {labels: [], series: [[], []]}}
                let len = rawData.length;

                var tmp = []
                for (var i = 0; i < len; i++) {
                    tmp.push(rawData[i]);
                }
                tmp.sort(function(a, b) {
                    return sending ? moment(a.dateSent).isAfter(moment(b.dateSent)) : moment(a.dateReceived).isAfter(moment(b.dateReceived))
                });
                rawData = tmp

                let isSuperuser = auth.role() === 'SUPER';
                for (var i = 0, index = -1; i < len; i++) {
                    if (start && moment(rawData[i].dateSent).isBefore(start)) {
                        console.log("before")
                        continue;
                    }
                    if (end && moment(rawData[i].dateSent).isAfter(end)) {
                        console.log("after")
                        continue;
                    }
                    if (sending && (rawData[i].senderCompany !== auth.companyName() && !isSuperuser)) {
                     console.log("not sender")
                     continue;
                     }
                     if (!sending && (rawData[i].receiverCompany !== auth.companyName()) && !isSuperuser) {
                     console.log("not receiver")
                     continue;
                     }
                    if (!sending && selectedCompany && selectedCompany !== '-' && (selectedCompany !== rawData[i].receiverCompany)) {
                        console.log("not receiver selected / " + selectedCompany)
                        continue;
                    }
                    if (sending && selectedCompany && selectedCompany !== '-' && (selectedCompany !== rawData[i].senderCompany)) {
                        console.log("not sender selected")
                        continue;
                    }

                    //fragile, enforce id ordering from server or use a map!
                    if (i > 0 && rawData[i - 1].id === rawData[i].id) {
                        continue;
                    }

                    let date = null
                    if(this.sending) {
                        date = moment(rawData[i].dateSent)
                    } else {
                        date = moment(rawData[i].dateReceived)
                    }

                    //let date = rawData[i].dateSent.split('T')[0];
                    let dateString = date.format('DD.MMM')
                    if (result.data.labels[index] !== dateString) {
                        index++;
                        result.data.labels[index] = dateString
                    }

                    if (!result.data.series[0][index]) {
                        result.data.series[0][index] = 0;
                    }

                    /*if (!result.data.series[1][index]) {
                        result.data.series[1][index] = 0;
                    }*/

                    result.data.series[0][index]++
                    this.total_ok += rawData[i].nrFailures > 0 ? 0 : 1

                    this.total_not_arrived += rawData[i].isReceived ? 0:1
                    this.total_out_spec += rawData[i].nrFailures > 0 ? 1 : 0
                }

                //result.data.labels.reverse();
                //result.data.series.reverse();

                this.total_ok -= this.total_not_arrived;
                console.log(rawData)
                return result;
            },
            processDetail2(rawData) {
                var result = {
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: i18.t('temperature'),
                                fill: false,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "rgba(75,192,192,1)",
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "rgba(75,192,192,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 2,
                                pointHitRadius: 2,
                                data: []
                            },
                        ]
                    }
                };

                if(rawData) {
                    let len = rawData.length;
                    for (var i = 0; i < len; i++) {
                        let date = moment(rawData[i].timestamp);
                        let label = date.format('DD.MM.YYYY hh:mm')
                        result.data.labels[i] = label;
                        result.data.datasets[0].data[i] = rawData[i].temperature;
                    }
                }
                return result;
            },
            processSenderNames(rawData) {
                var result = new Set();
                let len = rawData.length;
                result.add('-')
                for (var i = 0, index = -1; i < len; i++) {
                    if (rawData[i].senderCompany) {
                        result.add(rawData[i].senderCompany)
                    }
                }
                return Array.from(result)
            },
            processRecipientNames(rawData) {
                var result = new Set();
                let len = rawData.length;
                result.add('-')
                for (var i = 0, index = -1; i < len; i++) {
                    if (rawData[i].receiverCompany) {
                        result.add(rawData[i].receiverCompany)
                    }
                }
                return Array.from(result)
            },
            filter() {
                if (this.sending) {
                    this.recipientCompany = ""
                    this.senderCompany = this.selected
                } else {
                    this.recipientName = this.selected
                    this.senderCompany = ""
                }
                this.updateChart()
                this.updateTable()
            },
            updateParcelsOverview(senderCompanies, data) {
                var countTransit = 0;
                var countOK = 0;
                var countNrFailures = 0;
                var countSent = 0;
                data.forEach(function (element, index, array) {
                    if(element.isReceived == false) {
                        countTransit++;
                    }
                    if(element != undefined) {
                        if (element.nrFailures == 0) {
                            countOK++;
                        }
                        else {
                            countNrFailures += element.nrFailures;
                        }
                    }
                    if(senderCompanies.includes(element.sender) && index == 0 || index > 0 && array[index - 1].id != element.id) {
                        countSent ++;
                    }
                });
                this.totalNrSent = countSent;
                this.totalNrTransit = countTransit;
                this.totalNrOK = countOK;
                this.totalNrOfFailures = countNrFailures;
            },
            processPieChart(data) {
                var result = {data: {series: [0, 0, 0], labels:[]}};
                data.forEach(function (element) {
                    var nrFailures = element[7].nrFailures;
                    if(nrFailures > 0) {
                        result.data.series[0]++;
                    }
                    else if(nrFailures == 0) {
                        result.data.series[1]++;
                    }
                    else {
                        result.data.series[2]++;
                    }
                });
                function sum(a, b) {
                    return a + b;
                }
                result.data.series.forEach(function (element) {
                    result.data.labels.push(Math.round(element / result.data.series.reduce(sum) * 100) + '%');
                });
                return result;
            }
        }
    }
</script>
<style>

    .ct-chart-bar .ct-label.ct-horizontal.ct-end {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        text-align: center;
        max-height: 1em;
        min-width: 50px;
        max-width: 50px;
        position: relative;
        top: 15px;
    }

    .ct-chart-pie .ct-label {
        color: white;
    }


    .detail-graph .ct-series-a .ct-line,
    .detail-graph .ct-series-a .ct-point {
        stroke: blue;
    }

    line.ct-bar {
        stroke: #25a9e1 !important;
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

    @media screen {
        #printSection {
            display: none;
        }
    }

    .piechart-ok {
        stroke: #90ee90;
    }

    .piechart-outspec {
        stroke: #ffa500;
    }

    .piechart-notarrived {
        stroke: #c86463;
    }

    .green {
        color: #90ee90 !important;
    }

    .orange {
        color: #ffa500;
    }

    dl, dd {
        word-break: break-word;
    }

</style>