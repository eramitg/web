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

function filter(rawData) {
    var result = []
    let len = rawData.length;
    console.log(rawData)
    for (var i = 0, index = 0; i < len; i++) {
        result[i] = [];
        result[i][0] = rawData[i].name
        result[i][1] = rawData[i].company.name
        result[i][2] = rawData[i].role
        result[i][3] = rawData[i].ID
        result[i][4] = rawData[i].ID
        result[i][5] = rawData[i].ID
    }
    console.log(result)
    return result
}

export default {
    async mounted() {

        var result = 'hallo'
        console.log('Role:' + auth.role())
        if(auth.role() === 'ADMIN') {
            result = await this.loadCompanyUsers()
        } else if(auth.role() === 'SUPER') {
            result = await this.loadAllUsers()
        }
        let data = filter(result)
        console.log(result)

        $('#example').on( 'click', 'tbody td:not(:first-child)', function (e) {
            editor.inline( this );
        } );

        $('#example').DataTable( {
            "data": data,
            "columns": [
                { "title": "Name" },
                { "title": "Company" },
                { "title": "Role" },
                { "title": "Password" },
                { "title": "Repeat Password" },
                { "title": "Action" }
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

    data() { return {
        isAdmin: auth.role() === 'ADMIN',
        isSuper: auth.role() === 'SUPER'
    }}
  }
</script>