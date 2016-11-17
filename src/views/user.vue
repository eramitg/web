<template>
  <div class="tile is-ancestor" v-if="users">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <div class="container">
          <h1 class="title">
            Users
            <button class="button" @click="showModal = true">
              <span class="fa fa-user-plus"></span>
            </button>
          </h1>
        </div>
        <hr>
        <data-table :data="flatUsers" :columns="table.columns" :options="table.options"></data-table>
      </article>
    </div>
    <modal :active="showModal" title="Create/Edit User" @close="closeModal">
      <user-form :user="form"></user-form>
      <button slot="footer" type="submit" class="button is-primary" @click.prevent="formSave">Save changes</button>
      <button slot="footer" class="button" @click="closeModal">Cancel</button>
    </modal>
  </div>
</template>

<script>
  import DataTable from '../components/DataTable.vue';
  import Modal from '../components/Modal.vue';
  import UserForm from '../forms/UserForm.vue';
  import axios from 'axios';
  import store from '../store';

  export default {
    components: {
      DataTable,
      Modal,
      UserForm
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
        form: {
          username: '',
          password: '',
          role: 'USER'
        },
        table: {
          columns: ['name', 'companyName', 'role', 'delete'],
          options: {
            templates: {
              delete: (h, row) => {
                return <button class="button is-danger" on-click={() => this.deleteUser(row)}><i class="fa fa-trash"></i></button>
              }
            }
          }
        }
      }
    },
    computed: {
      flatUsers(){
        return this.users ? this.users.map(user => ({
          id: user.ID,
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
      },
      resetForm(){
        this.form = {
          id: null,
          username: '',
          password: '',
          role: 'USER'
        }
      },
      formSave(){
        try {
          let index = this.users.findIndex(u => u.ID === this.form.id);
          if (index !== -1){

          } else {
            this.createUser();
          }
        } catch(e) {
          // Notification for exception is created globally
        }
      },
      async createUser(){
        try{
          let {data} = await axios.post('/api/v1/company/admin/create', {...this.form});
          this.closeModal();
          if(data){
            this.users.push(data);
            this.$store.dispatch('notify', {type: 'success', text: `Successfully created User ${data.name}`})
          }
        } catch(e){
        }
      },
      async deleteUser(user){
        try{
          await this.$store.dispatch('confirm');
          if(user.id > 0){
            let {data} = await axios.delete(`/api/v1/company/admin/delete/${user.id}`)
            let index = this.users.findIndex(u => u.ID === data.ID);
            if(index){
              this.users.splice(index, 1);
            }
            this.$store.dispatch('notify', {type: 'success', text: `Successfully deleted User ${data.name}`})
          }
        } catch(e){
          // Notification for exception is created globally
        }
      }
    }
  }
</script>