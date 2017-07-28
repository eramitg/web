<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Companies
          <button v-if="$store.getters.hasRole == 'SUPER'" class="button" @click="showModal = true">
            <span class="fa fa-plus"></span>
          </button>
        </h1>
        <hr>
        <data-table
          v-if="$store.getters.hasRole == 'SUPER'"
          ref="vuetable"
          url="companies"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
          :query="table.query"
        >
          <template slot="actions" scope="props">
            <button class="button is-primary" @click="clickUpdate(props.rowData)"><i class="fa fa-pencil"/></button>
          </template>
        </data-table>

        <div v-else>
          <form-select
            v-model.number="test.defaultTemperatureCategoryIndex"
            label="Temperature Categories"
            :options="tempCategories"
            horizontal
          />
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

    <modal :active="showModal" title="Create/Edit Company" @close="closeModal" @submit="submitForm" form>
      <form-input v-model="form.name" label="Company name" placeholder="Name" v-validate="'required'" name="company name" :err="errors.first('company name')" />
      <form-input v-model.number="form.interval" type="number" label="Measurement Interval" placeholder="interval" v-validate="'required'" name="interval" :err="errors.first('interval')" />
      <button slot="footer" type="submit" class="button is-primary" @click.prevent="submitForm">Save changes</button>
      <button slot="footer" type="button" class="button" @click.prevent="closeModal">Cancel</button>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import DataTable from '../components/DataTable'
  import FormInput from '../components/FormInput.vue'
  import FormSelect from '../components/FormSelect.vue'
  import Modal from '../components/Modal.vue'
  export default {
    components: {
      FormInput,
      FormSelect,
      DataTable,
      Modal
    },
    async beforeRouteEnter (to, from, next) {
      let {data} = await Vue.http.get('companies')
      next(vm => {
        vm.$data.company = data
      })
    },
    data () {
      return {
        company: null,
        showModal: false,
        form: {
          id: null,
          name: '',
          interval: 10
        },
        test: {
          recipients: null,
          temperatureCategories: [
            {
              label: 'Temperature Ambient: 15-20',
              value: {
                name: 'AMBIENT',
                tempHigh: 25,
                tempLow: 15
              }
            },
            {
              label: 'Temperature Cool: 2-8',
              value: {
                name: 'Cool',
                tempHigh: 8,
                tempLow: 2
              }
            }
          ],
          defaultTemperatureCategoryIndex: 0,
          defaultMeasurementInterval: 10,
          canDoMultiSensorShipments: false
        },
        table: {
          columns: [
            {name: 'name', title: 'Name', sortField: 'name'},
            {name: 'interval', title: 'Default Measurement Interval', sortField: 'interval'},
            {name: '__slot:actions', title: 'Actions', dataClass: 'has-text-centered'}
          ],
          sortOrder: [{
            field: 'name',
            direction: 'asc'
          }],
          query: [
            {name: 'Name', field: 'name'},
            {name: 'Interval', field: 'interval'}
          ]
        }
      }
    },
    computed: {
      json: {
        get () {
          try {
            return this.company ? JSON.parse(window.atob(this.company.info)) : []
          } catch (e) {
            return []
          }
        },
        set (newValue) {
          this.company.info = window.btoa(newValue)
        }
      },
      selectedTempCat () {
        this.test.defaultTemperatureCategoryIndex
        return this.test.defaultTemperatureCategoryIndex
        ? this.test.temperatureCategories[this.test.defaultTemperatureCategoryIndex]
        : null
      },
      tempCategories () {
        return this.test.temperatureCategories.map((item, idx) => ({
          label: item.label,
          value: idx
        }))
      }
    },
    methods: {
      closeModal () {
        this.showModal = false
        // reset, when the modal is no longer visible, fix validation flickering
        Vue.nextTick(() => {
          this.resetForm()
        })
      },
      resetForm () {
        this.form = {
          id: null,
          name: '',
          interval: 10
        }
        // validation has to first happen, so that it can be reset
        Vue.nextTick(() => this.errors.clear())
      },
      async save () {
        try {
          await this.$http.put('v1/company/admin/update', {...this.company})
          this.$store.dispatch('notify', {type: 'success', text: 'Successfully updated Settings'})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
          console.log(e)
        }
      },
      async createCompany () {
        try {
          let {data} = await this.$http.post('companies', {
            name: this.form.name,
            interval: this.form.interval
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully created Company ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
        }
      },
      async deleteCompany ({ID}) {
        if (ID > 0) {
          try {
            await this.$store.dispatch('confirm')
            let {data} = await this.$http.delete(`v1/company/delete/${ID}`)
            this.$refs.vuetable.reload()
            this.$store.dispatch('notify', {type: 'success', text: `Successfully deleted Company ${data.name}`})
          } catch (e) {
            // Notification for exception is created globally
            this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
          }
        }
      },
      async updateCompany () {
        try {
          let {data} = await this.$http.put(`companies/${this.form.id}`, {
            name: this.form.name,
            interval: this.form.interval
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully updated Company ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
        }
      },
      async submitForm () {
        try {
          let success = await this.$validator.validateAll()
          if (success) {
            if (this.form.id === null) {
              this.createCompany()
            } else {
              this.updateCompany()
            }
            this.closeModal()
          }
        } catch (e) {
          console.log(e)
        }
      },
      clickUpdate ({id, name, interval}) {
        this.form.id = id
        this.form.name = name
        this.form.interval = interval
        this.showModal = true
      }
    }
  }
</script>
