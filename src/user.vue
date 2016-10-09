<template>
<div>
    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Users</h2>
                    <div class="col-sm-4">
                        <button class="btn btn-default" @click="submit()">
                            <i class="fa fa-user-plus" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
                        <table id="example" class="table table-striped table-bordered dataTable no-footer" width="100%"
                               cellspacing="0"></table>
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
                        <h4 class="modal-title">Set/Reset Password</h4>
                    </div>
                    <div class="modal-body row">
                        <div class="col-sm-12">
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
                        <button id="save" type="button" class="btn btn-default" ref="save" data-dismiss="details-dialog" @click="setPassword()">Save</button>
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
import * as JSONMetaTable from "json-meta-table/public/json-meta-table-bundle.js"


function filter(rawData) {
    var result = []
    let len = rawData.length;
    console.log(rawData)
    for (var i = 0, index = 0; i < len; i++) {
        result[i] = [];
        result[i]['id'] = rawData[i].ID
        result[i]['values'] = []
        result[i]['values']['name'] = rawData[i].name
        result[i]['values']['company'] = rawData[i].company.ID
        result[i]['values']['companyName'] = rawData[i].company.name
        result[i]['values']['role'] = rawData[i].role
    }
    console.log(result)
    return result
}

//global variable
let tableInstance

export default {
    async mounted() {

        var result = null
        console.log('Role:' + auth.role())
        let companyMeta
        if(auth.role() === 'ADMIN') {
            companyMeta = {name: 'companyName', label: 'Company', type: 'text', editable: false}
        }
        if(auth.role() === 'SUPER') {
            if(!this.companies) {
                this.companies = await this.loadCompanies()
                console.log(this.companies)
            }
            let options = this.companies.map((obj) => {return {value: obj.ID, label: obj.name}})
            companyMeta = {name: 'company', label: 'Company', type: 'select', options:  options}
        }

        console.log(result)

        tableInstance = new JSONMetaTable.default('#example')
        tableInstance.options.tableClass = "table table-responsive"
        tableInstance.options.columnFiltering = false
        tableInstance.options.inlineDeleting = false

        var action = {
            name:      'delete',
            type: 'button',
            text:      '<i class="fa fa-times text-danger"></i>',
            title:     'Delete this row',
            className: 'btn btn-default btn-xs',
            event:     this.remove.bind(tableInstance)
        }

        var action2 = {
            name:      'password',
            type:      'button',
            className: 'btn btn-default btn-xs',
            text:      '<i class="fa fa-cog" aria-hidden="true"></i>',
            title:     'Set Password',
            event:     this.password.bind(tableInstance)
        }
        tableInstance.actions = [action, action2]

        tableInstance.setMetadata([
            {name: 'name', label: 'Name', type: 'text'},
                    companyMeta,
            {name: 'role', label: 'Role', type: 'select',
             options:  [
                    {value: 'ADMIN', label: 'ADMIN'},
                    {value: 'USER', label: 'USER'}
             ]}
        ])

        tableInstance.on('updateRow:post', async (args) => {
            console.log('oldValue', args.row)
            console.log('newValue', args.newValue)
            result = await this.updateUser(args.row)
            if(args.row.id < 0) {
                args.row.id = result.ID
            }
        })

        if(auth.role() === 'ADMIN') {
            result = await this.loadCompanyUsers()
        } else if(auth.role() === 'SUPER') {
            result = await this.loadAllUsers()
        }
        this.data = filter(result)

        $("#save").prop("disabled",true)

    },
    methods: {
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
        async setPassword() {
            $('#details-dialog').modal('hide');
            console.log("set password " + this.currentRowId)
            return utils.ajax({
                data: JSON.stringify({
                    username: this.currentName,
                    password: this.passwordSet1}),
                type: "PUT",
                url: "/api/v1/company/admin/changepw/"+this.currentRowId,
                dataType: "json",
                contentType: "application/json",
                headers: auth.authHeader()
            });
        },
        async remove(row) {
            console.log("async call to remove user if > 0: " + row.id)
            let data = this.data.filter((item) => {
                return (item.id !== row.id)
            })

            this.data = data
            if(row.id <= 0) {
                return
            }

            return utils.ajax({
                type: "DELETE",
                url: "/api/v1/company/admin/delete/"+row.id,
                dataType: "json",
                contentType: "application/json",
                headers: auth.authHeader()
            });

        },
        async updateUser(row) {
            console.log("update or insert new user: " + row.id)
            if(row.id > 0) {
                return utils.ajax({
                    data: JSON.stringify({
                        id: row.id,
                        name: row.values.name,
                        role: row.values.role,
                        companyId: auth.role() === 'SUPER' ? row.values.company : auth.companyId(),
                    }),
                    type: "PUT",
                    url: "/api/v1/company/admin/update/"+row.id,
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            } else {
                return utils.ajax({
                    data: JSON.stringify({
                        username: row.values.name,
                        password: Math.random().toString(36).substring(7),
                        companyId: auth.role() === 'SUPER' ? row.values.company : auth.companyId()}),
                    type: "POST",
                    url: "/api/v1/company/admin/create",
                    dataType: "json",
                    contentType: "application/json",
                    headers: auth.authHeader()
                });
            }

            this.data = data
        },
        password(row) {
            this.currentRowId = row.id
            this.currentName = row.values.name
            console.log("async call to remove user if > 0: " + row.id)
            $('#details-dialog').modal('show');
        },
        submit() {
            if(this.data) {
                if(auth.role() === 'SUPER') {
                    this.data.push({'id': -1, 'values': {'name': 'new user', 'company': this.companies[0].ID, 'role': 'USER'}})
                }
                if(auth.role() === 'ADMIN') {
                    this.data.push({'id': -1, 'values': {'name': 'new user', 'company': auth.companyId(), 'role': 'USER'}})
                }
            }
        }
    },

    data() { return {
        data : null,
        companies: null,
        passwordSet1: null,
        passwordSet2: null,
        currentRowId: null,
        currentName: null
    }},
    watch: {
        'data' : function (val, oldVal) {
            console.log("data")
            console.log(val)
            if(tableInstance) {
                tableInstance.setData(val)
            }
        },
        'passwordSet1' : function (val, oldVal) {
            if(this.passwordSet1 == this.passwordSet2 && this.passwordSet1 && this.passwordSet2) {
                console.log(this.$refs.save)
                $("#save").prop("disabled",false)
                //this.$refs.save.prop('disabled', false)
            }
        },
        'passwordSet2' : function (val, oldVal) {
            if(this.passwordSet1 == this.passwordSet2 && this.passwordSet1 && this.passwordSet2) {
                $("#save").prop("disabled",false)
            }
        }

    }
  }
</script>

<style>
    .example {width: 100%;}
 .json-meta-table-sortable {
     width: 20%;
 }

</style>