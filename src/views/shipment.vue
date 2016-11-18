<template>
  <div class="tile is-ancestor" v-if="shipments">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <div class="container">
          <h1 class="title">
            Shipments
            <button class="button" @click.prevent="showModal = true">
              <span class="fa fa-plus"></span>
            </button>
          </h1>
        </div>
        <hr>
        <data-table :data="flatShipments" :columns="table.columns" :options="table.options"></data-table>
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

  export default {
    components: {
      DataTable,
      ModalForm
    },
    async beforeRouteEnter(to, from, next){
      let {data} = await axios.get('/api/preparedshipments');
      next(vm => vm.$data.shipments = data)
    },
    data(){
      return {
        shipments: null,
        showModal: false,
        table: {
          columns: ['tnt', 'receiver', 'tempCategory', 'created', 'delete'],
          options: {
            headings: {
              tnt: this.$t('tnt'),
              receiver: this.$t('rcv_comp')
            },
            templates: {
              delete: function(h, row) {
                console.log(row);
                return <button id={row.id} class="button is-danger"><i class="fa fa-trash"></i></button>
              }
            }
          }
        }
      }
    },
    computed: {
      flatShipments(){
        return this.shipments ? this.shipments.map(item => ({
          tnt: item.tnt,
          receiver: item.receiver.name,
          tempCategory: `${item.tempCategory.name}: ${item.tempCategory.minTemp}-${item.tempCategory.maxTemp} °C`,
          created: item.CreatedAt
        })) : [];
      }
    },
    methods: {
      closeModal(){
        this.showModal = false;
      }
    }
  }
</script>