<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">Company</h1>
        <hr>
        <div v-for="item in json">
          <form-select
            v-if="item.type == 'select'"
            v-model="item.value"
            :label="item.label"
            :options="item.options"
            horizontal
          />
          <form-input
            v-else
            v-model="item.value"
            :label="item.label"
            :type="item.type"
            horizontal
          />
        </div>
        <button type="button" class="button is-primary" @click="save">Save</button>
        <textarea v-model="json"></textarea>

        <form-select
          :value="test.defaultTemperatureCategoryIndex"
          @input="test.defaultTemperatureCategoryIndex = JSON.parse(arguments[0])"
          label="Temperature Categories"
          :options="tempCategories"
          horizontal
        />
        <form-select
          :value="test.canDoMultiSensorShipments"
          @input="test.canDoMultiSensorShipments = JSON.parse(arguments[0])"
          label="Multiple Shipments"
          :options="[{label: 'Yes',value: true}, {label: 'No', value: false}]"
          horizontal
        />
        <form-input
          v-model="test.defaultMeasurementInterval"
          label="Measurement Interval in Minutes"
          type="number"
          horizontal
        />
      </article>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import FormInput from '../components/FormInput.vue';
  import FormSelect from '../components/FormSelect.vue';
  export default {
    components: {
      FormInput,
      FormSelect
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
