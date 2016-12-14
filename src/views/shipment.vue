<template>
  <div class="tile is-ancestor" v-if="parcels">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <div class="container">
          <h1 class="title">
            Parcels
            <button class="button" @click.prevent="showModal = true">
              <span class="fa fa-plus"></span>
            </button>
          </h1>
        </div>
        <hr>
        <data-table :data="momentParcels" :columns="table.columns" :options="table.options"></data-table>
      </article>
    </div>
    <modal-form :active="showModal" title="Create/Edit Shipment" @close="closeModal">
      <p>Test</p>
      <button slot="footer" class="button is-primary">Save changes</button>
      <button slot="footer" class="button is-danger">Save changes</button>
    </modal-form>
  </div>
  <div v-else>
    Make sure you have an internet connection
  </div>
</template>

<script>
  import DataTable from '../components/DataTable.vue';
  import ModalForm from '../components/ModalForm.vue';
  import axios from 'axios';
  import moment from 'moment';

  export default {
    components: {
      DataTable,
      ModalForm
    },
    async beforeRouteEnter(to, from, next){
      let {data} = await axios.get('/api/parcels');
      next(vm => vm.$data.parcels = data)
    },
    data(){
      return {
        parcels: null,
        showModal: false,
        table: {
          columns: ['tntNumber', 'senderCompany', 'receiverCompany', 'dateSent', 'dateReceived', 'details'],
          options: {
            dateColumns: ['dateSent', 'dateReceived'],
            orderBy: {
              column: 'dateSent',
            },
            headings: {
              tntNumber: this.$t('tnt'),
              senderCompany: this.$t('send_comp'),
              receiverCompany: this.$t('rcv_comp'),
              dateSent: this.$t('date_sent'),
              dateReceived: this.$t('date_received')
            },
            templates: {
              details: function(h, row) {
                return <button id={row.id} class="button is-primary">Zeigen</button>
              }
            },
          }
        },
      }
    },
    computed: {
      momentParcels(){
        return this.parcels ?
        this.parcels.map(item => {
          item.dateSent = moment(item.dateSent).format('DD.MM.YYYY, HH:mm');
          item.dateReceived = moment(item.dateReceived).format('DD.MM.YYYY, HH:mm');
          return item
        })
        : []
      }
    },
    methods: {
      closeModal(){
        this.showModal = false;
      }
    }
  }
</script>