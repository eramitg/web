<template>
    <div>
        <div class="row" v-if="!authenticated">
            <div class="col-sm-12">
                <p class="text-center">Keine Informationen verfügbar. Bitte loggen Sie sich ein.</p>
            </div>
        </div>
        <div v-if="authenticated" class="row tile_count">
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Total # Sendungen verschickt</span>
                <div class="count">{{totalNrSent}}</div>
                <div class="count"></div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Total # Sendungen OK</span>
                <div class="count">{{totalNrOK}}</div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Total # Abweichungen</span>
                <div class="count green">{{totalNrOfFailures}}</div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top">Total # nicht angekommen</span>
                <div class="count"></div>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top"># Sendungen unterwegs</span>
                <div class="count">{{totalNrTransit}}</div>
            </div>
        </div>
        <div v-if="authenticated" class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="dashboard_graph x_panel">
                    <div class="row x_title">
                        <div class="col-sm-4 col-xs-12">
                            <input type="text" name="daterange" class="form-control" value="01/01/2015 - 01/31/2015"/>
                        </div>
                        <div class="col-sm-2 col-xs-12">
                            <input name="checkbox" class="dropdown-toggle" checked data-toggle="toggle" type="checkbox"
                                   data-on="Sender"
                                   data-off="Empfänger">
                        </div>
                        <div class="col-sm-2 col-xs-12">
                            <div class="btn-group">
                                <select class="form-control" v-model="selected">
                                    <option v-if="sending" v-for="recipientName in recipientNames"
                                            v-bind:value="recipientName" @click="filter()">{{ recipientName }}
                                    </option>
                                    <option v-if="!sending" v-for="senderName in senderNames" v-bind:value="senderName"
                                            @click="filter()">{{ senderName }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-9 col-xs-12">
                        <div ref="chart" class="overview-graph"></div>
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-12 bg-white">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="x_title">Anteil Gut/Temperatur überschritten/In Arbeit</div>
                            <div ref="pieChart" class=""></div>
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="x_title">Anzahl Sendungen pro Tag</div>
                        <div ref="barChart"></div>
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
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">Details</h4>
                    </div>
                    <div class="modal-body row">
                        <div class="col-sm-9">
                            <div class="x_panel">
                                <div class="x_title">
                                    <h5>Temperature Measurements</h5>
                                </div>
                                <div class="x_content">
                                    <div ref="chart2" class="overview-graph"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="x_panel">
                                <div class="x_title">
                                    <h5>Infos</h5>
                                </div>
                                <div>
                                    <dl>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
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
        // Disable line smoothing
        lineSmooth: false,
        // X-Axis specific configuration
        axisX: {
            // We can disable the grid for this axis
            //showGrid: false,
            // and also don't show the label
            showLabel: true
            //labelInterpolationFnc: function skipLabels(value, index, labels) {
            //    return index % Math.round(labels.length / 15) === 0 ? value : null;
            //}
        },
        height: 200,
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
            showLabel: true,
            labelInterpolationFnc: function skipLabels(value, index, labels) {
                return index % Math.round(labels.length / 8) === 0 ? value : null;
            }
        },
        axisY: {
            high: 40,
            low: -10,
            labelInterpolationFnc: function skipLabels(value, index, labels) {
                return value + '°C';
            }
        },
        height: 600,
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

            this.updateChart();
            this.senderNames = this.processSenderNames(this.results)
            this.recipientNames = this.processRecipientNames(this.results)
            this.chart = new Chartist.Bar(this.$refs.chart, this.data, options)


            var data = {
                series: [5, 3, 4]
            };

            var sum = function(a, b) { return a + b };

            new Chartist.Pie(this.$refs.chartPie, data, {
                labelInterpolationFnc: function(value) {
                    return Math.round(value / data.series.reduce(sum) * 100) + '%';
                }
            });
            //new Chartist.Pie(this.$refs.chartPie, this.data, option)

            this.chartDetail = new Chartist.Line(this.$refs.chart2, [], optionsDetail)

            var barChartData = {
                labels: this.data.labels,
                series: [
                    [5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
                ]
            };


            this.barChart = new Chartist.Bar(this.$refs.barChart, barChartData, {});

            //this.dataSet = this.processTable(this.results, this.start, this.end)w
            this.updateParcelsOverview(this.senderNames, this.results);
            this.updateTable();
            this.updatePieChart();
            this.pieChart = new Chartist.Pie(this.$refs.pieChart, this.dataPieChart, {});
            this.table = $('#table').DataTable({
                responsive: true,
                language: {
                    zeroRecords: i18.t('zero_records')
                },
                data: this.dataSet,
                colReorder: true,
                "columns": [
                    {
                        "title": i18.t('send_comp'),
                        "render": function (data, type, full, meta) {
                            return data ? data : "-"
                        }
                    },
                    {
                        "title": i18.t('send_user'),
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
                        "title": i18.t('rcv_user'),
                        "render": function (data, type, full, meta) {
                            return data ? data : "-"
                        }
                    },
                    {
                        "title": i18.t('date_sent'),
                        "render": function (data, type, full, meta) {
                            let date = moment(data)
                            if (date.valueOf() <= 0) return "n/a"
                            return date.format('DD.MM.YYYY, HH:mm')
                        }
                    },
                    {
                        "title": i18.t('date_received'),
                        "render": function (data, type, full, meta) {
                            let date = moment(data)
                            if (date.valueOf() <= 0) return "n/a"
                            return moment(data).format('DD.MM.YYYY, HH:mm')
                        }
                    },
                    {
                        "title": i18.t('transit'),
                        "render": function (data, type, full, meta) {
                            let a = moment(full[5])
                            let b = moment(full[4])
                            let diff = a.diff(b, 'hours', true)
                            if (diff < 0) return "n/a";
                            return a.diff(b, 'hours', true).toFixed(1) + 'h'
                        }
                    },
                    {"title": i18.t('tnt')}, {"title": i18.t('cat')}, {
                        "title": i18.t('status'),
                        "render": function (data, type, full, meta) {
                            if (data < 0) {
                                return i18.t('status_transit')
                            }
                            return data === 0 ? i18.t('status_ok') : i18.t('status_bad')
                        }

                    },
                    {
                        "title": i18.t('details'),
                        "render": function (data, type, full, meta) {

                            //console.log(meta.row)
                            return '<button type="button" id="btn" data-toggle="modal" data-loading-text="Loading..." class="btn btn-default" autocomplete="off">' + i18.t('show') + '</button>';
                        }
                    }
                ]
            });

            var tmp = this.table
            $('#table tbody').on('click', 'button', async function () {
                let row = tmp.row($(this).parents('tr'))
                let pid = row.data()[12]
                console.log(pid)
                var res = await
                        that.parcelDetails(pid);
                console.log(res)
                that.dataDetail = that.processDetail(res).data
                $('#details-dialog').modal('show');
            })


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
                dataDetail: '',
                dataPieChart: '',
                table: '',
                chart: '',
                chartDetail: '',
                pieChart: '',
                barChart: '',
                sending: true,
                senderNames: '',
                recipientNames: '',
                senderName: '',
                recipientName: '',
                authenticated: auth.token() != "n/a",
                totalNrSent: '',
                totalNrTransit: '',
                totalNrOK: '',
                totalNrOfFailures: ''
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
            'dataDetail': function (val, oldVal) {
                console.log("dataDetail")
                console.log(val)
                this.chartDetail.update(val)
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
            'recipientName': function (val, oldVal) {
                this.updateTable();
                this.updateChart();
            },
            'senderName': function (val, oldVal) {
                this.updateTable();
                this.updateChart();
            }
        },
        methods: {
            updateTable () {
                this.dataSet = this.processTable(this.results, this.start, this.end, this.sending, this.senderName, this.recipientName)
            },
            updateChart () {
                this.data = this.process(this.results, this.start, this.end, this.sending, this.senderName, this.recipientName).data
            },
            updatePieChart() {
                this.dataPieChart = this.processPieChart(this.dataSet).data
            },
            async parcels() {
                return await utils.ajax({
                    type: "GET",
                    url: "/api/v2/users/parcels/web",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async parcelDetails(pid) {
                return await utils.ajax({
                    type: "GET",
                    url: "/api/v2/users/parcels/details/" + pid,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            processTable(rawData, start, end, sending, senderName, recipientName) {
                var result = []
                let len = rawData.length;
                console.log("sender name" + senderName)
                for (var i = 0, index = 0; i < len; i++) {
                    console.log(rawData[i].id + "/" + i);
                    console.log(rawData[i]);

                    //console.log("adding1 id:"+rawData[i].id+ " / "+index)
                    if (start && moment(rawData[i].dateSent).isBefore(start)) {
                        console.log("before")
                        continue;
                    }
                    if (end && moment(rawData[i].dateSent).isAfter(end)) {
                        console.log("after")
                        continue;
                    }
                    if (sending && rawData[i].sender !== auth.userName()) {
                        console.log("not sender")
                        continue;
                    }
                    if (!sending && rawData[i].receiver !== auth.userName()) {
                        console.log("not receiver")
                        continue;
                    }
                    if (sending && recipientName && recipientName !== '-' && recipientName !== rawData[i].receiver) {
                        console.log("not receiver selected " + recipientName + "/" + rawData[i].receiver)
                        continue;
                    }
                    if (!sending && senderName && senderName !== '-' && senderName !== rawData[i].sender) {
                        console.log("not sender selected")
                        continue;
                    }
                    //fragile, enforce id ordering from server or use a map!
                    if (index > 0 && result[index - 1][12] === rawData[i].id) {
                        console.log("fragile")
                        continue;
                    }
                    result[index] = [];
                    result[index][0] = rawData[i].sender
                    result[index][1] = rawData[i].sender
                    result[index][2] = rawData[i].receiver
                    result[index][3] = rawData[i].receiver
                    //result[index][4]= moment(rawData[i].dateSent).valueOf()
                    //result[index][5]= moment(rawData[i].dateReceived).valueOf()
                    result[index][6] = 'n/a'
                    result[index][7] = rawData[i].tntNumber
                    result[index][8] = rawData[i].tempCategory.name
                    //-1 means not finished yet
                    result[index][9] = (!rawData[i].result.isFailed && !rawData[i].result.isSuccess) ? -1 : rawData[i].result.nrFailures
                    result[index][10] = rawData[i].measurements
                    result[index][11] = i
                    result[index][12] = rawData[i].id
                    console.log("adding2 id:" + rawData[i].id + " / " + index)
                    index++
                }
                console.log("processed: " + result.length)
                return result;
            },
            process(rawData, start, end, sending, senderName, recipientName) {
                var result = {data: {labels: [], series: [[], []]}}
                let len = rawData.length;
                for (var i = 0, index = -1; i < len; i++) {
                    if (start && moment(rawData[i].dateSent).isBefore(start)) {
                        console.log("before")
                        continue;
                    }
                    if (end && moment(rawData[i].dateSent).isAfter(end)) {
                        console.log("after")
                        continue;
                    }
                    if (sending && rawData[i].sender !== auth.userName()) {
                        console.log("not sender")
                        continue;
                    }
                    if (!sending && rawData[i].receiver !== auth.userName()) {
                        console.log("not receiver")
                        continue;
                    }
                    if (sending && recipientName && recipientName !== '-' && recipientName !== rawData[i].receiver) {
                        console.log("not receiver selected")
                        continue;
                    }
                    if (!sending && senderName && senderName !== '-' && senderName !== rawData[i].sender) {
                        console.log("not sender selected")
                        continue;
                    }

                    //fragile, enforce id ordering from server or use a map!
                    if (index > 0 && rawData[index - 1][12] === rawData[i].id) {
                        continue;
                    }

                    let date = rawData[i].dateSent.split('T')[0];
                    if (result.data.labels[index] !== date) {
                        index++;
                        result.data.labels[index] = date
                    }

                    if (!result.data.series[0][index]) {
                        result.data.series[0][index] = 0;
                    }
                    if (!result.data.series[1][index]) {
                        result.data.series[1][index] = 0;
                    }

                    result.data.series[0][index]++
                    result.data.series[1][index] += rawData[i].result.nrFailures > 0 ? 1 : 0
                }
                return result;
            },
            processDetail(rawData) {
                console.log(rawData)
                var result = {data: {labels: [], series: [[], []]}}
                let len = rawData.measurements.length;
                console.log("len: " + len)
                for (var i = 0, index = 0; i < len; i++) {
                    let len2 = rawData.measurements[i].measurements.length;
                    console.log("len3: " + len2)
                    for (var j = 0; j < len2; j++) {
                        let date = moment(rawData.measurements[i].measurements[j].timestamp);
                        let label = date.format('DD.MM.YYYY hh:mm')
                        result.data.labels[index] = label
                        result.data.series[0][index] = rawData.tempCategory.maxTemp;
                        result.data.series[1][index] = rawData.measurements[i].measurements[j].temperature;
                        index++;
                    }

                }
                console.log(result)
                return result;
            },
            processSenderNames(rawData) {
                var result = new Set();
                let len = rawData.length;
                result.add('-')
                for (var i = 0, index = -1; i < len; i++) {
                    if (rawData[i].sender) {
                        result.add(rawData[i].sender)
                    }
                }
                return Array.from(result)
            },
            processRecipientNames(rawData) {
                var result = new Set();
                let len = rawData.length;
                result.add('-')
                for (var i = 0, index = -1; i < len; i++) {
                    if (rawData[i].receiver) {
                        result.add(rawData[i].receiver)
                    }
                }
                return Array.from(result)
            },
            filter() {
                if (this.sending) {
                    this.recipientName = ""
                    this.senderName = this.selected
                } else {
                    this.recipientName = this.selected
                    this.senderName = ""
                }
                this.updateChart()
                this.updateTable()
            },
            updateParcelsOverview(senderNames, data) {
                var countTransit = 0;
                var countOK = 0;
                var countNrFailures = 0;
                var countSent = 0;
                data.forEach(function (element, index, array) {
                    if(element.isReceived == false) {
                        countTransit++;
                    }
                    if(element.result != undefined) {
                        if (element.result.nrFailures == 0) {
                            countOK++;
                        }
                        else {
                            countNrFailures += element.result.nrFailures;
                        }
                    }
                    if(senderNames.includes(element.sender) && index == 0 || index > 0 && array[index - 1].id != element.id) {
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
                    var nrFailures = element[9];
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

    line.ct-bar {
        stroke: #7d83ff !important;
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