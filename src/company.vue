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
                <button class="btn btn-primary" @click="save()">Save</button>
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
            add/remove/change companies
        </div>

    </div>
</template>

<script>
    import auth from './auth.js'
    import utils from './utils.js'
    export default {
        async mounted() {
            try {
                if(this.isSuper) {
                    this.loadCompanies().then(tmp => {
                        this.companies = tmp.map((obj) => {console.log(obj.info); return {"value": obj.ID, "label": obj.name, "info": obj.info}})
                        this.selectedCompany = this.companies[0].value;
                    })
                } else {
                    let rawData = await this.loadCompany()
                    console.log(rawData)
                    this.json = JSON.parse(window.atob(rawData.info));
                }


           } catch (err) {
                console.log(err)
                this.error = err
            }
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
                selectedCompany: null
            }
        },
        methods: {
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
                    } catch (err) {
                        this.error ="invalid json 1"
                    }
                    if(tmp) {
                        this.json = tmp
                    }
                    else {
                        this.error ="invalid json: "+tmp
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
            }
        }
    }
</script>

<style>
    .table {
        text-align: left
    }

</style>