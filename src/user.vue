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
                    <h2>Users</h2>
                    <div class="col-sm-4">
                        <button id="btn" data-toggle="modal" data-target="#details-dialog" class="btn btn-default" name="-1">
                            <i class="fa fa-user-plus" aria-hidden="true"></i>
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
                        <h4 class="modal-title">Create/Edit User</h4>
                    </div>
                    <div class="modal-body row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <input type="text" value="" placeholder="Username" class="form-control"
                                       v-model="username">
                            </div>

                            <div class="form-group">
                            <div class="btn-group">
                                <select class="form-control" v-model="selectedCompany">
                                    <option v-for="company in companies" v-bind:value="company.value">{{ company.label }}</option>
                                </select>
                            </div>
                            </div>

                            <div class="form-group" v-if="currentUserId > 0">
                            <div class="btn-group">
                                <select class="form-control" v-model="selectedRole">
                                    <option v-for="role in roles" v-bind:value="role.value">{{ role.label }}</option>
                                </select>
                            </div>
                            </div>

                            <div class="form-group">
                                <input type="password" value="" placeholder="Password" class="form-control"
                                       v-model="passwordSet1">
                            </div>
                            <div class="form-group">
                                <input type="password" value="" placeholder="Password" class="form-control"
                                       v-model="passwordSet2">
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

<script>

    import auth from './auth.js'
    import utils from './utils.js'
    //import * as JSONMetaTable from "json-meta-table/public/json-meta-table-bundle.js"
    import $ from 'jquery';
    require("datatables.net");
    require("datatables.net-colreorder");

    var table2;




function filter(rawData) {
    var result = []
    let len = rawData.length;
    console.log(rawData)
    for (var i = 0, index = 0; i < len; i++) {
        result[rawData[i].ID] = [];
        result[rawData[i].ID]['name'] = rawData[i].name
        result[rawData[i].ID]['company'] = rawData[i].company.ID
        result[rawData[i].ID]['companyName'] = rawData[i].company.name
        result[rawData[i].ID]['role'] = rawData[i].role
    }
    console.log(result)
    return result
}

function filter2(rawData) {
    var result = []
    let len = rawData.length;
    console.log(rawData)
    for (var i = 0, index = 0; i < len; i++) {
        result[i] = []
        result[i][0] = rawData[i].name

        result[i][1] = rawData[i].company.name
        result[i][2] = rawData[i].role

        result[i][3] = rawData[i].company.ID
        result[i][4] = rawData[i].ID
    }
    console.log(result)
    return result
}

export default {
    async mounted() {
        if(auth.role() === 'ADMIN') {
            //drop-down with one name
            this.companies = [{value: auth.companyId(), label: auth.companyName()}]
        }
        if(auth.role() === 'SUPER') {
            let tmp = await this.loadCompanies()
            this.companies = tmp.map((obj) => {return {value: obj.ID, label: obj.name}})
        }
        this.selectedCompany = this.companies[0].value;

        this.roles = auth.roles()
        this.selectedRole = this.roles[0].value;

        this.loadData()

        table2 = $('#table').DataTable({
            responsive: true,
            language: {
                zeroRecords: 'zero_records'
            },
            data: [],
            colReorder: true,
            "columns": [
                {"title": "Name"},
                {"title": "Company"},
                {"title": "Role"},
                {
                    "title": 'Edit',
                    "render": function (data, type, full, meta) {
                        return '<button data-toggle="modal" data-target="#details-dialog" name="'+full[4]+'" type="button" id="btn" class="btn btn-default" autocomplete="off"><li class="fa fa-cog" aria-hidden="true"></li></button>' +
                                '<button name="'+full[4]+'" type="button" id="btnRemove" class="btn btn-default" autocomplete="off"><li class="fa fa-times text-danger"></li></button>';
                    }
                }
            ]
        });

        var that = this
        $(document).on("click", "#btn", function () {
            let userId = parseInt($(this)[0].name)
            that.currentUserId = userId;
            if(userId && userId > 0) {
                that.username = that.dataLookup[userId].name
                that.selectedCompany = that.dataLookup[userId].company
                that.selectedRole = that.dataLookup[userId].role
            } else {
                that.username = ''
                that.selectedCompany = that.companies[0].value;
                that.selectedRole = that.roles[0].value;
            }
            that.toggleSave();
        });
        $(document).on("click", "#btnRemove", function () {
            let userId = parseInt($(this)[0].name)
            if(userId && userId > 0) {
                that.remove(userId)
            }
        });

        this.toggleSave();
    },
    methods: {
        async loadData() {
            let rawData = [];
            if(auth.role() === 'ADMIN') {
                rawData = this.loadCompanyUsers()
            } else if(auth.role() === 'SUPER') {
                rawData = this.loadAllUsers()
            }
            rawData.then(rawData => {this.dataSet = filter2(rawData); this.dataLookup = filter(rawData)})
            return rawData;
        },
        async loadAllUsers() {
            return utils.ajax({
                type: "GET",
                url: "/api/v1/company",
                dataType: "json",
                contentType: "application/json",
                headers: auth.authHeader()
            });
        },
        async loadCompanyUsers() {
            return utils.ajax({
                type: "GET",
                url: "/api/v1/company/admin",
                dataType: "json",
                contentType: "application/json",
                headers: auth.authHeader()
            });
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
        async remove(userId) {
            console.log("async call to remove user if > 0: " + userId)
            let data = this.dataSet.filter((item) => {
                return (item[4] !== userId)
            })

            this.dataSet = data
            if(userId <= 0) {
                return
            }

            let p1= utils.ajax({
                type: "DELETE",
                url: "/api/v1/company/admin/delete/"+userId,
                dataType: "json",
                contentType: "application/json",
                headers: auth.authHeader()
            });
            return p1.then(() => {this.loadData(); this.oktext="deleted ok"});

        },
        async createUpdate() {
            console.log("update or insert new user: " + this.currentUserId)
                if (this.currentUserId > 0) {
                    try {
                        //update userdata
                        let p1 = utils.ajax({
                            data: JSON.stringify({
                                id: this.currentUserId,
                                name: this.username,
                                role: this.selectedRole,
                                companyId: auth.role() === 'SUPER' ? this.selectedCompany : auth.companyId(),
                            }),
                            type: "PUT",
                            url: "/api/v1/company/admin/update/" + this.currentUserId,
                            dataType: "json",
                            contentType: "application/json",
                            headers: auth.authHeader()
                        });
                        //change password
                        if(this.passwordSet1) {
                            let p2 = utils.ajax({
                                data: JSON.stringify({
                                    username: this.username,
                                    password: this.passwordSet1
                                }),
                                type: "PUT",
                                url: "/api/v1/company/admin/changepw/" + this.currentUserId,
                                dataType: "json",
                                contentType: "application/json",
                                headers: auth.authHeader()
                            });

                            return Promise.all([p1, p2]).then(() => {this.loadData();$('#details-dialog').modal('hide');});
                        } else {
                            console.log("only update with one call");
                            return p1.then(() => {this.loadData();$('#details-dialog').modal('hide');this.oktext="updated ok"});
                        }
                    }
                    catch (err) {
                        this.error = err;
                    }

                } else {
                    try {
                        let p1 = utils.ajax({
                            data: JSON.stringify({
                                username: this.username,
                                password: this.passwordSet1,
                                companyId: auth.role() === 'SUPER' ? this.selectedCompany : auth.companyId()
                            }),
                            type: "POST",
                            url: "/api/v1/company/admin/create",
                            dataType: "json",
                            contentType: "application/json",
                            headers: auth.authHeader()
                        });
                        p1.then(() => {this.loadData(); $('#details-dialog').modal('hide');this.oktext="created ok"})
                        return p1
                    } catch (err) {
                        this.error = err;
                    }
                }

        },
        dismissDialog() {
            this.error = '';
            this.oktext = '';
        },
        toggleSave() {
            if(this.currentUserId > 0 && !this.passwordSet1 && !this.passwordSet2) {
                $("#save").prop("disabled",false)
            } else if(this.passwordSet1 == this.passwordSet2 && this.passwordSet1 && this.passwordSet2) {
                $("#save").prop("disabled",false)
            } else {
                $("#save").prop("disabled",true)
            }
        }
    },

    data() { return {
        dataSet : null,
        dataLookup: null,
        companies: null,
        passwordSet1: null,
        passwordSet2: null,
        currentRowId: null,
        error: '',
        oktext: '',
        username: null,
        selectedCompany: null,
        companies: null,
        selectedRole: null,
        roles: null,
        currentUserId: -1
    }},
    watch: {
        'passwordSet1' : function (val, oldVal) {
            this.toggleSave();
        },
        'passwordSet2' : function (val, oldVal) {
            this.toggleSave();
        },
        'dataSet': function (val, oldVal) {
            table2.clear()
            if (val.length > 0) {
                table2.rows.add(val)
            }
            table2.draw()
        }
    }
  }
</script>

<style></style>