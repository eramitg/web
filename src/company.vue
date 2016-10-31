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

        <div v-if="isAdminOrSuper" class="row">
            <div class="col-sm-12">
                <div class="form-group" v-for="item in json">

                    <label v-if="item.type == 'text'">
                        {{item.name}}
                        <input type="text" value="" class="form-control" v-model="item.value">
                    </label>
                    <select class="btn-control" v-model="item.value" v-if="item.type == 'select'">
                        <option v-for="option in item.options" v-bind:value="option.value">{{ option.label }}</option>
                    </select>
                </div>
                <button id="save" class="btn btn-primary" @click="save()">Save</button>
                <div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Raw JSON <span class="caret"></span>
                    </button>
                    <textarea v-model="jsonstring" class="dropdown-menu form-control" rows="20" cols="200" id="comment"></textarea>
                </div>
                <div class="btn-group" v-if="isSuper">
                    <div class="btn-group">
                        <select class="form-control" v-model="selectedCompany">
                            <option v-for="company in companies" v-bind:value="company.value">{{ company.label }}</option>
                        </select>
                    </div>
                </div>


            </div>
        </div>

        <div v-if="isSuper">
            <!-- add/remove/change companies -->

            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="x_panel">
                        <div class="x_title">
                            <h2>Company</h2>
                            <div class="col-sm-2">
                                <button id="btn" data-toggle="modal" data-target="#details-dialog" class="btn btn-default" name="-1">
                                    +<i class="fa fa-cog" aria-hidden="true"></i>
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
                <div id="details-dialog" class="modal fade">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title">Create/Edit Company</h4>
                            </div>
                            <div class="modal-body row">
                                <div class="col-sm-12">
                                    <div class="form-horizontal form-label-left">
                                        <div class="form-group">
                                            <label class="control-label col-sm-3">Name of the Company</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control"
                                                       v-model="companyName">
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

    </div>
</template>

<script>
    import auth from './auth.js'
    import utils from './utils.js'

    var companyTable;

    export default {
        async mounted() {
            try {
                if(this.isSuper) {
                    this.load()
                } else {
                    let rawData = await this.loadCompany()
                    console.log(rawData)
                    this.json = JSON.parse(window.atob(rawData.info));
                }


           } catch (err) {
                console.log(err)
                this.error = err
           }

            companyTable = $('#table').DataTable({
                responsive: true,
                language: {
                    zeroRecords: 'zero_records'
                },
                data: this.companies,
                colReorder: true,
                "columns": [
                    {"title": "Name",
                        "render": function (data, type, full, meta) {
                            return full.label;
                        }
                    },
                    {
                        "title": 'Edit',
                        "render": function (data, type, full, meta) {
                            return '<div class="col-sm-2"><button data-toggle="modal" data-target="#details-dialog" name="'+full.value+'" type="button" id="btn" class="btn btn-default" autocomplete="off"><li class="fa fa-cog" aria-hidden="true"></li></button></div>' +
                                    '<div class="col-sm-2"><button name="'+full.value+'" type="button" id="btnRemove" class="btn btn-default" autocomplete="off"><li class="fa fa-times text-danger"></li></button>';
                        }
                    }
                ]
            });

            var that = this
            $(document).on("click", "#btn", function () {
                that.companyId = parseInt($(this)[0].name)
                if(that.companyId && that.companyId > 0) {
                    for(var i=0;i<that.companies.length;i++) {
                        if(that.companies[i].value === that.companyId) {
                            that.companyName = that.companies[i].label
                        }
                    }
                }

            });
            $(document).on("click", "#btnRemove", function () {
                let companyId = parseInt($(this)[0].name)
                if(companyId && companyId > 0) {
                    that.remove(companyId)
                }
            });
        },
        data () {
            return {
                error: '',
                oktext: '',
                isAdminOrSuper: auth.token() && auth.role() === 'ADMIN' || auth.role() === 'SUPER',
                isSuper: auth.token() && auth.role() === 'SUPER',
                json: null,
                jsonstring: null,
                companies: null,
                selectedCompany: null,
                companyName: null,
                companyId: null
            }
        },
        methods: {
            async createUpdate() {
                let p1
                if(this.companyId <= 0) {
                    p1 = utils.ajax({
                        data: JSON.stringify(
                                {"name": this.companyName,
                                 "info": window.btoa("[]")}
                        ),
                        type: "POST",
                        url: "/api/v1/company",
                        dataType: "json",
                        contentType: "application/json",
                        headers: auth.authHeader()
                    });
                } else {
                    p1 = utils.ajax({
                        data: JSON.stringify(
                                {"name": this.companyName}
                        ),
                        type: "PUT",
                        url: "/api/v1/company/update/" + this.companyId,
                        dataType: "json",
                        contentType: "application/json",
                        headers: auth.authHeader()
                    });
                }
                $('#details-dialog').modal('hide');
                await p1
                this.load()
            },
            async load() {
                let tmp = await this.loadCompanies()
                this.companies = tmp.map((obj) => {console.log(obj.info); return {"value": obj.ID, "label": obj.name, "info": obj.info}})
                this.selectedCompany = this.companies[0].value;
            },
            dismissDialog() {
                this.error = ''
                this.oktext = ''
            },
            async loadCompanies() {
                return utils.ajax({
                    type: "GET",
                    url: "/api/v1/company/companies",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async remove(companyId) {
                await utils.ajax({
                    type: "DELETE",
                    url: "/api/v1/company/delete/"+companyId,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
                this.load()
            },
            async loadCompany() {
                return utils.ajax({
                    type: "GET",
                    url: "/api/v1/company/admin/company",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            },
            async save() {
                return utils.ajax({
                    data: JSON.stringify(
                            {"info" : window.btoa(this.jsonstring)}
                    ),
                    type: "PUT",
                    url: this.isSuper? "/api/v1/company/update/"+this.selectedCompany : '/api/v1/company/admin/update',
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            }
        },
        watch: {
            'jsonstring': function (val, oldVal) {
                    let tmp = null
                    try {
                        tmp = JSON.parse(val)
                        this.json = tmp
                        $("#save").prop("disabled",false)
                        this.error = ''
                    } catch (err) {
                        this.error ="invalid json"
                        $("#save").prop("disabled",true)
                    }
            },
            'json': {
                handler: function (val, oldVal) {
                    this.jsonstring =  JSON.stringify(val)
                },
                deep: true
            },
            'selectedCompany': function (val, oldVal) {
                //save value
                if(oldVal) {
                    this.companies.find((row) => {
                        return row.value === oldVal
                    }).info = window.btoa(this.jsonstring)
                }
                try {
                    this.json = JSON.parse(window.atob(this.companies.find((row) => {return row.value === val}).info));
                } catch (err) {
                    this.error = err
                }
            },
            'companies': function (val, oldVal) {
                companyTable.clear()
                if (val.length > 0) {
                    companyTable.rows.add(val)
                }
                companyTable.draw()
                this.companyName = ''
            }
        }
    }
</script>

<style>
    .table {
        text-align: left
    }

</style>