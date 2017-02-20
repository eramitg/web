<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Prepared Shipments
          <button class="button" @click="showModal = true">
            <span class="fa fa-plus"></span>
          </button>
        </h1>
        <hr>
        <data-table
          ref="vuetable"
          url="/api/preparedshipments"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
        >
          <template slot="actions" scope="props">
            <button class="button is-danger" @click="deleteShipment(props.rowData)"><i class="fa fa-trash"></button>
          </template>
        </data-table>
      </article>
    </div>
    <modal :active="showModal" title="Create/Edit Shipment" @close="closeModal" @submit="createUpdateShipment" form>
      <form-input v-model="form.tntNumber" label="Track & Trace" v-validate data-vv-rules="required" name="tnt" :err="errors.first('tnt')" />
      <form-select v-model="selectedTempCat" label="Temperature Category" :options="tempOptions"/>
      <button slot="footer" type="submit" class="button is-primary" @click.prevent="createUpdateShipment">Save changes</button>
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
    DataTable,
    Modal,
    FormInput,
    FormSelect
  },
  async beforeRouteEnter (to, from, next) {
    try {
      let {data} = await Vue.http.get('/api/v1/company/defaults')
      next(vm => {
        vm.$data.temperatureCategories = data.temperatureCategories
        vm.$data.recipients = data.recipients
      })
    } catch (e) {
      next()
    }
  },
  data () {
    return {
      showModal: false,
      temperatureCategories: [],
      selectedTempCat: 0,
      recipients: null,
      form: {
        id: null,
        receiverID: null,
        tntNumber: '',
        tempCategory: null
      },
      table: {
        columns: [
          {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tnt_number'},
          {name: 'senderCompanyName', title: this.$t('send_comp'), sortField: 'senderCompanyName'},
          {name: 'receiverCompanyName', title: this.$t('rcv_comp'), sortField: 'receiverCompanyName'},
          {name: 'temperatureCategoryDescription', title: 'Temperatures', sortField: 'temperatureCategoryDescription'},
          {name: 'createdAt', title: 'Created', callback: 'formatDate', sortField: 'createdAt'},
          {name: '__slot:actions', title: 'Actions', dataClass: 'has-text-centered'}
        ],
        sortOrder: [{
          field: 'createdAt',
          direction: 'desc'
        }]
      }
    }
  },
  computed: {
    tempOptions () {
      return this.temperatureCategories.map((item, idx) => ({
        label: item.label,
        value: idx
      }))
    },
    selectedTempCatObj () {
      return this.selectedTempCat < this.temperatureCategories.length
      ? {
        name: this.temperatureCategories[this.selectedTempCat].value.name,
        minTemp: this.temperatureCategories[this.selectedTempCat].value.tempLow,
        maxTemp: this.temperatureCategories[this.selectedTempCat].value.tempHigh
      }
      : null
    }
  },
  methods: {
    closeModal () {
      this.showModal = false
    },
    resetForm () {
      this.form = {
        id: null,
        receiverID: null,
        tntNumber: '',
        tempCategory: null
      }
    },
    createUpdateShipment () {
      this.$validator.validateAll()

      if (this.formFields.valid()) {
        if (this.form.id === null) {
          this.createShipment()
        } else {
          this.updateShipment()
        }
        this.closeModal()
      }
    },
    async createShipment () {
      try {
        let {data} = await this.$http.post('/api/preparedshipments', {
          ...this.form,
          tempCategory: this.selectedTempCatObj
        })
        this.$refs.vuetable.reload()
        console.log(data)
        this.$store.dispatch('notify', {type: 'success', text: `Successfully prepared Shipment ${data.tntNumber}`})
        this.resetForm()
      } catch (e) {
        this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
      }
    },
    async updateShipment () {
      try {
        let {data} = await this.$http.put(`/api/preparedshipments/${this.form.id}`, {
          ...this.form,
          tempCategory: this.selectedTempCatObj
        })
        this.$refs.vuetable.reload()
        this.$store.dispatch('notify', {type: 'success', text: `Successfully updated Shipment ${data.tntNumber}`})
        this.resetForm()
      } catch (e) {
        this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
      }
    },
    async deleteShipment ({Id}) {
      if (Id > 0) {
        try {
          await this.$store.dispatch('confirm')
          let {data} = await this.$http.delete(`/api/preparedshipments/${Id}`)
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully deleted Shipment ${data.tntNumber}`})
        } catch (e) {
          // Notification for exception is created globally
        }
      }
    },
    editShipment ({Id, receiverCompanyID, tntNumber, temperatureCategory}) {
      this.form.id = Id
      this.form.receiverID = receiverCompanyID
      this.form.tntNumber = tntNumber
      this.form.tempCategory = {
        name: temperatureCategory.name,
        minTemp: temperatureCategory.minTemp,
        maxTemp: temperatureCategory.maxTemp
      }
      this.showModal = true
    }
  }
}
</script>
