<template>
    <div>
        <div class="alert alert-danger" v-if="error">
            <a href="#" class="close" v-on:click.prevent="dismissDialog()">&times;</a>
            <p>{{ error }}</p>
        </div>

        <div class="alert alert-success" v-if="oktext">
            <a href="#" class="close" v-on:click.prevent="dismissDialog()">&times;</a>
            <p>{{ oktext }}</p>
        </div>

        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <h2>Missing Contracts / TX</h2>
                    <div class="x_content">
                        <div class="table">
                            <table id="tableMissing" ref="tableMissing" class="table dataTable table-responsive no-footer"></table>
                        </div>
                    </div>

                    <h2>Mined Contracts / TX</h2>
                    <div class="x_content">
                        <div class="table">
                            <table id="tableMined" ref="tableMined" class="table dataTable table-responsive no-footer"></table>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>
<style>

</style>
<script>

    import auth from './auth.js'
    import utils from './utils.js'
    var blockchainTableMissing;
    var blockchainTableMined;
    var moment = require("moment/min/moment-with-locales.js")
    var locale = window.navigator.userLanguage || window.navigator.language; //returns e.g. en-US
    moment.locale(locale)

    export default{

        async mounted() {

            blockchainTableMissing = $('#tableMissing').DataTable({
                order: [[ 1, "desc" ]],
                responsive: true,
                language: {
                    zeroRecords: 'zero_records'
                },
                data: this.dataSet,
                colReorder: true,
                "columns": [
                    {"title": "Track-and-trace"},
                    {
                        "title": "Date Sent",
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
                        "title": "TX Hash",
                        "render": function (data, type, full, meta) {
                            let pre = ''
                            if(data) {
                                pre = '<a href="https://etherscan.io/tx/'+data+'">'+data.substr( 0, 32 ) +'…'+'</a>'
                            }
                            return  pre + '<button name="'+full[4]+'/'+full[5]+'" type="button" id="tx_hash" class="btn btn-default" autocomplete="off">Report Temp.</button>'
                        }
                    },
                    {"title": "Contract Hash",
                        "render": function (data, type, full, meta) {
                            let pre = ''
                            if(data) {
                                pre = '<a href="https://etherscan.io/address/'+data+'">'+data.substr( 0, 32 ) +'…'+'</a>'
                            }
                            return pre + '<button name="'+full[4]+'/'+full[5]+'" type="button" id="contract" class="btn btn-default" autocomplete="off">Create Contract</button>'
                        }},
                    {
                        "title": 'Cache Result',
                        "render": function (data, type, full, meta) {
                            return '<button name="'+full[4]+'/'+full[5]+'" type="button" id="mined" class="btn btn-default" autocomplete="off">Check Mined</button>';
                        }
                    }
                ]
            });

            blockchainTableMined = $('#tableMined').DataTable({
                responsive: true,
                language: {
                    zeroRecords: 'zero_records'
                },
                data: this.dataSet,
                colReorder: true,
                "columns": [
                    {"title": "Track-and-trace"},
                    {
                        "title": "Date Sent",
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
                        "title": "TX Hash",
                        "render": function (data, type, full, meta) {return '<a href="https://etherscan.io/tx/'+data+'">'+data.substr( 0, 32 ) +'…'+'</a>'}
                    },
                    {
                        "title": "Contract Hash",
                        "render": function (data, type, full, meta) {return '<a href="https://etherscan.io/address/'+data+'">'+data.substr( 0, 32 ) +'…'+'</a>'}
                    }
                ]
            });

            var that = this
            $(document).on("click", "#tx_hash", async function () {
                let arr = ($(this)[0].name).split("/")
                let parcelId = parseInt(arr[0])
                let groupId = parseInt(arr[1])

                console.log("tx_hash id:"+parcelId+"/"+groupId)
                try {
                    that.oktext = await that.contract(parcelId, groupId, "tx")
                } catch (err) {
                    that.error = err
                }
            });
            $(document).on("click", "#contract", async function () {
                let arr = ($(this)[0].name).split("/")
                let parcelId = parseInt(arr[0])
                let groupId = parseInt(arr[1])

                console.log("contract id:"+parcelId+"/"+groupId)
                try {
                    that.oktext = await that.contract(parcelId, groupId, "contract")
                } catch (err) {
                    that.error = err
                }
            });
            $(document).on("click", "#mined", async function () {
                let arr = ($(this)[0].name).split("/")
                let parcelId = parseInt(arr[0])
                let groupId = parseInt(arr[1])

                console.log("mined id:"+parcelId+"/"+groupId)
                try {
                    that.oktext = await that.contract(parcelId, groupId, "mined")
                } catch (err) {
                    that.error = err
                }
            });

            let rawDataMissing = await this.loadMissingData()
            this.dataSetMissing = rawDataMissing.map(row => {
                var result = []
                result[0] = row.tntNumber
                result[1] = row.dateSent
                result[2] = row.transaction_hash
                result[3] = row.contract_address
                result[4] = row.id
                result[5] = row.gid
                return result
            });

            let rawDataMined = await this.loadMinedData()
            this.dataSetMined = rawDataMined.map(row => {
                var result = []
                result[0] = row.tntNumber
                result[1] = row.dateSent
                result[2] = row.transaction_hash
                result[3] = row.contract_address
                result[4] = row.id
                result[5] = row.gid
                return result
            });
        },

        data(){
            return{
                error: '',
                oktext: '',
                dataSetMissing: null,
                dataSetMined: null
            }
        },
        methods: {
            async loadMissingData() {
                return utils.ajax({
                    type: "GET",
                    url: "/api/v1/contract/missing",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async loadMinedData() {
                return utils.ajax({
                    type: "GET",
                        url: "/api/v1/contract/mined",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async contract(pid, gid, type) {
                return utils.ajax({
                    type: "GET",
                    url: "/api/v1/contract/type/"+pid+"/"+gid+"/"+type,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            dismissDialog() {
                this.error = '';
                this.oktext = '';
            }
        },
        watch: {
            'dataSetMissing': function (val, oldVal) {
                blockchainTableMissing.clear()
                if (val.length > 0) {
                    blockchainTableMissing.rows.add(val)
                }
                blockchainTableMissing.draw()
            },
            'dataSetMined': function (val, oldVal) {
                blockchainTableMined.clear()
                if (val.length > 0) {
                    blockchainTableMined.rows.add(val)
                }
                blockchainTableMined.draw()
            }
        }
    }
</script>
