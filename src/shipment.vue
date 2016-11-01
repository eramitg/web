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
                    <div class="x_title">
                        <h2>Shipments</h2>
                        <div class="col-sm-4">
                            <button id="btn" data-toggle="modal" data-target="#new-shipment" class="btn btn-default" name="-1">
                                + <i class="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content">
                        <div class="table">
                            <table id="table" ref="table" class="table dataTable table-responsive no-footer"></table>
                        </div>

                    </div>
                </div>
            </div>
            <!-- Modal HTML -->
            <div id="new-shipment" class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title">Create/Edit Shipment</h4>
                        </div>
                        <div class="modal-body row">
                            <div class="col-sm-12">

                                <div class="form-horizontal form-label-left">
                                    <div class="form-group">
                                        <label class="control-label col-lg-3">Track & Trace</label>
                                        <div class="col-lg-9">
                                            <input type="text" data-inputmask="'mask': '99.99.999999.99999999'" class="form-control"
                                                   v-model="tnt">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label col-lg-3">Recipient</label>
                                        <div class="col-lg-9">
                                            <select class="form-control" v-model="selectedRecipient">
                                                <option v-for="recipient in recipients" v-bind:value="recipient.value">{{ recipient.label }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="control-label col-lg-3">Temperature Category</label>
                                        <div class="col-lg-9">
                                            <select class="form-control" v-model="selectedTemperatureCategories">
                                                <option v-for="temperatureCategory in temperatureCategories" v-bind:value="temperatureCategory.value">{{ temperatureCategory.label }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button id="save" type="button" class="btn btn-default" ref="save" data-dismiss="details-dialog" @click="createUpdate()">Save</button>
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
    var shipmentTable;

    export default{

        async mounted() {
            shipmentTable = $('#table').DataTable({
                responsive: true,
                language: {
                    zeroRecords: 'zero_records'
                },
                data: this.dataSet,
                colReorder: true,
                "columns": [
                    {"title": "Track-and-trace"},
                    {"title": "Recipient"},
                    {"title": "Temperatures"},
                    {"title": "Created"},
                    {
                        "title": 'Edit',
                        "render": function (data, type, full, meta) {
                            return '<button data-toggle="modal" data-target="#new-shipment" name="'+full[4]+'" type="button" id="btn" class="btn btn-default" autocomplete="off"><li class="fa fa-cog" aria-hidden="true"></li></button>' +
                                    '<button name="'+full[4]+'" type="button" id="btnRemove" class="btn btn-default" autocomplete="off"><li class="fa fa-times text-danger"></li></button>';
                        }
                    }
                ]
            });

            this.loadCompany()
                .then(res => {
                    this.recipients = res.recipients;
                    this.temperatureCategories = res.temperatureCategories;
                })
                .catch(err => console.log(err))

            this.loadData();

            var that = this
            $(document).on("click", "#btn", function () {
                let shipmentId = parseInt($(this)[0].name)
                that.currentShipmentId = shipmentId;
                if(shipmentId && shipmentId > 0) {
                    //TODO: set data
                } else {
                    //TODO: clear data
                }
            });
            $(document).on("click", "#btnRemove", function () {
                let shipmentId = parseInt($(this)[0].name)
                if(shipmentId && shipmentId > 0) {
                    that.remove(userId)
                }
            });
        },

        data(){
            return{
                error: '',
                oktext: '',
                tnt: null,
                recipients: [{"label":"Modum.io", "value":1}],
                selectedRecipient: null,
                temperatureCategories: [{"label":"5-12", "value":1}],
                selectedTemperatureCategories: null,
                productCategories: [{"label":"Pills", "value":1}],
                selectedProductCategories: 1,
                transportMethods: [{"label":"Coldchain", "value":1}],
                selectedTransportMethod: 1,
                transportCompanies: [{"label":"DPD", "value":1}],
                selectedTransportCompany: 1,
                durations: [{"label":"8h", "value":1}],
                selectedDuration: 1,
                intervals: [{"label":"10min", "value":1}],
                selectedInterval: 1,
                dataSet: null,
                currentShipmentId: -1,
            }
        },
        computed: {
          currentJSON: function(){
            return {
              tnt: this.tnt,
              recipient: this.selectedRecipient,
              temperatureCategories: this.selectedTemperatureCategories
            }
          }
        },
        watch: {
          dataSet: function (val, oldVal) {
            console.log("dataSet")
            console.log(val)
            if (shipmentTable) {
              shipmentTable.clear()
              if (val.length > 0) {
                shipmentTable.rows.add(val)
              }
              shipmentTable.draw()
            }
          }
        },
        methods:{
            async loadData() {
                let asyncData = null;
                if(auth.role() === 'ADMIN') {
                    asyncData = this.loadAllShipments()
                } else if(auth.role() === 'SUPER') {
                    asyncData = this.loadAllShipments()
                }
                if(asyncData) {
                    let rawData = await asyncData

                    this.dataLookup = []
                    this.dataSet = rawData.map(row => {
                        var result = []
                        //create an additional lookup table
                        this.dataLookup[row.ID] = [];
                        this.dataLookup[row.ID]['tnt'] = result[0] = row.tnt
                        this.dataLookup[row.ID]['receiver'] = result[1] = row.receiver.name
                        this.dataLookup[row.ID]['tempCategory'] = result[2] = `Temperature Range: ${row.tempCategory.minTemp}-${row.tempCategory.maxTemp} °C`
                        this.dataLookup[row.ID]['createdAt'] = result[3] = row.CreatedAt
                        this.dataLookup[row.ID]['edit'] = result[4] = 1
                        //result[4] = row.ID
                        return result
                    });
                    return rawData
                }
                return []
            },
            async loadAllShipments() {
                return utils.ajax({
                    type: "GET",
                    url: "/api/preparedshipments",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async loadCompanyShipments() {
                return utils.ajax({
                    type: "GET",
                    url: "/api/v1/shipment/admin",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async shipmentUpdate() {
                return utils.ajax({
                    data: JSON.stringify({
                        id: this.currentShipmentId,
                        json: this.currentJSON,
                        companyId: auth.role() === 'SUPER' ? this.selectedCompany : auth.companyId(),
                    }),
                    type: "PUT",
                    url: "/api/v1/shipment/admin/update/" + this.currentShipmentId,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async shipmentCreate() {
                return utils.ajax({
                  data: JSON.stringify({
                    receiverID: parseInt(this.selectedRecipient),
                    tnt: this.tnt,
                    tempCategory: {"name": this.selectedTemperatureCategories.name,
                        "minTemp": this.selectedTemperatureCategories.tempLow,
                        "maxTemp": this.selectedTemperatureCategories.tempHigh}
                  }),
                  type: "POST",
                  url: "/api/preparedshipments",
                  dataType: "json",
                  contentType: "application/json",
                  headers: auth.authHeader()
                });
            },
            async createUpdate() {
                console.log("update or insert new shipment: " + this.currentShipmentId)
                if (this.currentShipmentId > 0) {
                    try {
                        let p1 = this.shipmentUpdate()
                        await p1
                        this.loadData();
                        $('#details-dialog').modal('hide')
                        this.oktext="updated ok"
                    }
                    catch (err) {
                        this.error = err;
                    }

                } else {
                    try {
                        let p1 = this.shipmentCreate()
                        await p1
                        this.loadData()
                        $('#details-dialog').modal('hide');
                        this.oktext="created ok"
                    } catch (err) {
                        this.error = err;
                    }
                }

            },
            loadCompany() {
                return utils.ajax({
                    type: "GET",
                    //url: "/api/v1/company/admin/company",
                    url: "/api/v1/company/defaults",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async remove(shipmentId) {
                console.log("async call to remove shipment if > 0: " + shipmentId)
                let data = this.dataSet.filter((item) => {
                    return (item[4] !== shipmentId)
                })

                this.dataSet = data
                if(shipmentId <= 0) {
                    return
                }

                let p1= utils.ajax({
                    type: "DELETE",
                    url: "/api/v1/shipment/delete/"+shipmentId,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
                await p1
                this.oktext="shipment deleted ok"
                this.loadData()
            },
            dismissDialog() {
                this.error = '';
                this.oktext = '';
            }
        }
    }
</script>
