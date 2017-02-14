<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">Company</h1>
        <hr>
        <data-table
          v-if="$store.getters.user.role == 'SUPER'"
          ref="vuetable"
          url="/api/v1/company/companies"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
        >
          <template slot="actions" scope="props">
            <button class="button is-primary" @click="editUser(props.rowData)"><i class="fa fa-pencil"></button>
            <button class="button is-danger" @click="deleteUser(props.rowData)"><i class="fa fa-trash"></button>
          </template>
        </data-table>

        <div v-else>
          <form-select
            v-model.number="test.defaultTemperatureCategoryIndex"
            label="Temperature Categories"
            :options="tempCategories"
            horizontal
          />
          <div class="control is-horizontal">
            <div class="control-label">
              <label class="label">Multiple Shipments</label>
            </div>
            <p class="control">
              <label class="radio">
                <input v-model="test.canDoMultiSensorShipments" type="radio" :value="true">Yes
              </label>
              <label class="radio">
                <input v-model="test.canDoMultiSensorShipments" type="radio" :value="false">No
              </label>
            </p>
          </div>

          <form-input
            v-model.number="test.defaultMeasurementInterval"
            label="Measurement Interval in Minutes"
            type="number"
            horizontal
          />
          <button type="button" class="button is-primary" @click="save">Save</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import DataTable from '../components/DataTable';
  import FormInput from '../components/FormInput.vue';
  import FormSelect from '../components/FormSelect.vue';
  export default {
    components: {
      FormInput,
      FormSelect,
      DataTable
    },
    async beforeRouteEnter(to, from, next) {
      let {data} = await axios.get("/api/v1/company/admin/company");
      next(vm => vm.$data.company = data);
    },
    data() {
      return {
        company: null,
        test: {
          "recipients": null,
          "temperatureCategories": [
            {
              "label": "Temperature Ambient: 15-20",
              "value": {
                "name": "AMBIENT",
                "tempHigh": 25,
                "tempLow": 15
              }
            },
            {
              "label": "Temperature Cool: 2-8",
              "value": {
                "name": "Cool",
                "tempHigh": 8,
                "tempLow": 2
              }
            }
          ],
          "defaultTemperatureCategoryIndex": 0,
          "defaultMeasurementInterval": 10,
          "canDoMultiSensorShipments": false
        },
        table: {
          columns: [
            {name: 'name', title: 'Name', sortField: 'name'},
            {name: '__slot:actions', title: 'Actions', dataClass: 'has-text-centered'},
          ],
          sortOrder: [{
            field: 'name',
            direction: 'asc'
          }]
        }
      }
    },
    computed: {
      json: {
        get() {
          try {
            return this.company ? JSON.parse(window.atob(this.company.info)) : [];
          } catch(e){
            return [];
          }
        },
        set(newValue) {
          this.company.info = window.btoa(newValue);
        }
      },
      selectedTempCat() {
        this.test.defaultTemperatureCategoryIndex
        return this.test.defaultTemperatureCategoryIndex ?
          this.test.temperatureCategories[this.test.defaultTemperatureCategoryIndex]
          : null;
      },
      tempCategories() {
        return this.test.temperatureCategories.map((item, idx) => ({
          label: item.label,
          value: idx
        }))
      }
    },
    methods: {
      async save() {
        try{
          let {data} = await axios.put('/api/v1/company/admin/update', {...this.company});
          this.$store.dispatch('notify', {type: 'success', text: 'Successfully updated Settings'})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
          console.log(e);
        }
      }
    }
  }
</script>
