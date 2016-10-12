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
    var userTable;

export default {
    async beforeMount() {
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

        userTable = $('#table').DataTable({
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
            let asyncData = null;
            if(auth.role() === 'ADMIN') {
                asyncData = this.loadCompanyUsers()
            } else if(auth.role() === 'SUPER') {
                asyncData = this.loadAllUsers()
            }
            if(asyncData) {
                let rawData = await asyncData

                this.dataLookup = []
                this.dataSet = rawData.map(row => {
                    var result = []
                    //create an additional lookup table
                    this.dataLookup[row.ID] = [];
                    this.dataLookup[row.ID]['name'] = result[0] = row.name
                    this.dataLookup[row.ID]['companyName'] = result[1] = row.company.name
                    this.dataLookup[row.ID]['role'] = result[2] = row.role
                    this.dataLookup[row.ID]['company'] = result[3] = row.company.ID
                    result[4] = row.ID
                    return result
                });
                return rawData
            }
            return []
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
            await p1
            this.oktext="deleted ok"
            this.loadData()
        },
        async adminUpdate() {
            return utils.ajax({
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
        },
        async adminChangePassword() {
            return utils.ajax({
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
        },
        async adminCreate() {
            return utils.ajax({
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
        },
        async createUpdate() {
            console.log("update or insert new user: " + this.currentUserId)
                if (this.currentUserId > 0) {
                    try {
                        let p1 = this.adminUpdate()
                        //change password
                        if(this.passwordSet1) {
                            let p2 = this.adminChangePassword()
                            await p1
                            await p2
                            this.loadData()
                            $('#details-dialog').modal('hide')
                        } else {
                            console.log("only update with one call");
                            await p1
                            this.loadData();$('#details-dialog').modal('hide')
                            this.oktext="updated ok"
                        }
                    }
                    catch (err) {
                        this.error = err;
                    }

                } else {
                    try {
                        let p1 = this.adminCreate()
                        await p1
                        this.loadData()
                        $('#details-dialog').modal('hide');
                        this.oktext="created ok"
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
            if((this.currentUserId > 0 && !this.passwordSet1 && !this.passwordSet2)
                    || (this.passwordSet1 == this.passwordSet2 && this.passwordSet1 && this.passwordSet2)) {
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
        roles: null,
        passwordSet1: null,
        passwordSet2: null,
        error: '',
        oktext: '',
        username: null,
        selectedCompany: null,
        selectedRole: null,
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
            userTable.clear()
            if (val.length > 0) {
                userTable.rows.add(val)
            }
            userTable.draw()
        }
    }
  }
</script>

<style></style>