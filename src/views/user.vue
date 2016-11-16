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
        <data-table :data="flatUsers" :columns="table.columns" :options="table.options"></data-table>
      </article>
    </div>
  </div>
</template>

<script>
  import DataTable from '../components/DataTable.vue';
  import Modal from '../components/Modal.vue';
  import axios from 'axios';
  import i18 from '../i18';
  import store from '../store';

  export default {
    components: {
      DataTable,
      Modal
    },
    async beforeRouteEnter(to, from, next){
      let role = store.getters.user.role;
      if(role == 'ADMIN'){
        let {data} = await axios.get('/api/v1/company/admin');
        next(vm => vm.$data.users = data)
      } else if(role == 'SUPER'){
        let {data} = await axios.get('/api/v1/company/admin');
        next(vm => vm.$data.users = data)
      }
      next();
    },
    data(){
      return {
        users: null,
        showModal: false,
        table: {
          columns: ['name', 'companyName', 'role'],
          options: {

          }
        }
      }
    },
    computed: {
      flatUsers(){
        return this.users ? this.users.map(user => ({
          name: user.name,
          companyName: user.company.name,
          role: user.role,
          companyId: user.company.ID
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