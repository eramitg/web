<template>
<div>

    <table id="example" class="display" width="100%" cellspacing="0"></table>

    <!--<form method="post" id="create-form">-->
    <!--Username: <input type="text" name="username"><br>-->
    <!--Password: <input type="password" name="password"><br>-->

    <!--</form>-->

    <button @click="submit()">New User</button>
    <select class="selectpicker">
        <option>Mustard</option>
        <option>Ketchup</option>
        <option>Relish</option>
    </select>
    <button @click="defaults()">Company Defaults</button>

</div>
</template>

<script>
import auth from './auth.js'
import utils from './utils.js'
import $ from 'jquery'
require("./assets/css/jquery.dataTables-modum.css")
require("datatables.net");
require("datatables.net-colreorder");



export default {
    async mounted() {

        var result = 'hallo'
        console.log('Role:' + auth.role())
        if(auth.role() === 'ADMIN') {

            result = await this.loadCompanyUsers()
        } else if(auth.role() === 'SUPER') {
            result = await this.loadAllUsers()
        }
        console.log(result)
        $('#example').DataTable( {
            "ajax": result,
            "columns": [
                { "data": "name" },
                { "data": "position" },
                { "data": "office" },
                { "data": "extn" },
                { "data": "start_date" },
                { "data": "salary" }
            ]
        } );

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
        }
    },

    data: {
        isAdmin: auth.role() === 'ADMIN',
        isSuper: auth.role() === 'SUPER'
    }
  }
</script>