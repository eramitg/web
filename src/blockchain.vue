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
                            <table id="table" ref="table" class="table dataTable table-responsive no-footer"></table>
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
    var blockchainTable;
    var moment = require("moment/min/moment-with-locales.js")
    var locale = window.navigator.userLanguage || window.navigator.language; //returns e.g. en-US
    moment.locale(locale)

    export default{

        async mounted() {

            blockchainTable = $('#table').DataTable({
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
                            return '<a href="https://etherscan.io/tx/'+data+'">'+data.substr( 0, 32 ) +'…'+'</a>'
                        }
                    },
                    {"title": "Contract Hash",
                        "render": function (data, type, full, meta) {
                            return '<a href="https://etherscan.io/address/'+data+'">'+data.substr( 0, 32 ) +'…'+'</a>'
                        }},
                    {
                        "title": 'Edit',
                        "render": function (data, type, full, meta) {
                            return '<button data-toggle="modal" data-target="#new-shipment" name="'+full[4]+'" type="button" id="btn" class="btn btn-default" autocomplete="off"><li class="fa fa-cog" aria-hidden="true"></li></button>' +
                                    '<button name="'+full[4]+'" type="button" id="btnRemove" class="btn btn-default" autocomplete="off"><li class="fa fa-times text-danger"></li></button>';
                        }
                    }
                ]
            });

            var that = this
            $(document).on("click", "#btn", function () {
                let parcelId = parseInt($(this)[0].name)
                that.currentParcelId = parcelId;
                if(parcelId && parcelId > 0) {
                    console.log("id:"+parcelId)
                } else {
                    //TODO: clear data
                }
            });
            $(document).on("click", "#btnRemove", function () {
                let parcelId = parseInt($(this)[0].name)
                if(parcelId && parcelId > 0) {
                    console.log("id:"+parcelId)
                }
            });

            let rawData = await this.loadData()

            this.dataLookup = []
            this.dataSet = rawData.map(row => {
                var result = []
                //create an additional lookup table
                this.dataLookup[row.id] = [];
                this.dataLookup[row.id]['tntNumber'] = result[0] = row.tntNumber
                this.dataLookup[row.id]['dateSent'] = result[1] = row.dateSent
                this.dataLookup[row.id]['transaction_hash'] = result[2] = row.transaction_hash
                this.dataLookup[row.id]['contract_address'] = result[3] = row.contract_address
                result[4] = row.id
                return result
            });
        },

        data(){
            return{
                error: '',
                oktext: '',
                dataLookup: null,
                dataSet: null,
                currentParcelId: null
            }
        },
        methods: {
            async loadData() {
                return utils.ajax({
                    type: "GET",
                    url: "/api/v1/contract/missing",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            }
        },
        watch: {
            'dataSet': function (val, oldVal) {
                blockchainTable.clear()
                if (val.length > 0) {
                    blockchainTable.rows.add(val)
                }
                blockchainTable.draw()
            }
        }
    }
</script>
