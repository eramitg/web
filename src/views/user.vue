<template>
  <div class="tile is-ancestor" v-if="users">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <div class="container">
          <h1 class="title">
            Users
            <button class="button">
              <span class="fa fa-user-plus"></span>
            </button>
          </h1>
        </div>
        <hr>
        <data-table :data="flatShipments" :columns="table.columns" :options="table.options"></data-table>
      </article>
    </div>
  </div>
</template>

<script>
  import DataTable from '../components/DataTable.vue';
  import Modal from '../components/Modal.vue';
  import axios from 'axios';
  import i18 from '../i18';

  export default {
    components: {
      DataTable,
      Modal
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
          columns: ['tnt', 'receiver', 'tempCategory', 'created'],
          options: {
            headings: {
              tnt: i18.t('tnt'),
              receiver: i18.t('rcv_comp')
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