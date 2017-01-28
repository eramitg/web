<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Users
          <button class="button" @click="showModal = true">
            <span class="fa fa-user-plus"></span>
          </button>
        </h1>
        <hr>
          <data-table url="/api/users" :fields="table.columns" :sortOrder="table.sortOrder" ref="table" />
      </article>
    </div>
    <modal :active="showModal" title="Create/Edit User" @close="closeModal" @submit="createUser" form>
      <form-input v-model="form.username" label="Username" placeholder="Name" v-validate data-vv-rules="required" name="username" :err="errors.first('username')" />
      <form-input v-model="form.password" label="Password" placeholder="Password" type="password" v-validate data-vv-rules="required" name="password" :err="errors.first('password')"/>
      <form-select v-model="form.role" label="Role" :options="['USER', 'ADMIN']"/>
      <button slot="footer" type="submit" class="button is-primary" @click.prevent="createUser">Save changes</button>
      <button slot="footer" type="button" class="button" @click.prevent="closeModal">Cancel</button>
    </modal>
  </div>
</template>

<script>
  import DataTable from '../components/Table'
  import FormInput from '../components/FormInput.vue';
  import FormSelect from '../components/FormSelect.vue';
  import Modal from '../components/Modal.vue';
  import Vue from 'vue'

  Vue.component('user-actions', {
    template: '<button class="button is-danger" @click="deleteUser(rowData)"><i class="fa fa-trash"></button>',
    props: {
      rowData: {
        type: Object,
        required: true
      },
      rowIndex: {
        type: Number
      }
    },
    methods: {
      async deleteUser ({userID, userName}) {
        if (userID > 0) {
          try{
            await this.$store.dispatch('confirm');
            let {data} = await this.$http.delete(`/api/users/${userID}`)
            this.$parent.reload();
            this.$store.dispatch('notify', {type: 'success', text: `Successfully deleted User ${data.name}`})
          } catch(e){
            // Notification for exception is created globally
          }
        }
      }
    }
  })

  export default {
    components: {
      DataTable,
      Modal,
      FormInput,
      FormSelect
    },
    data(){
      return {
        showModal: false,
        form: {
          username: '',
          password: '',
          role: 'USER'
        },
        table: {
          columns: [
            {name: 'userName', title: 'Name', sortField: 'userName'},
            {name: 'userRole', title: 'Role', sortField: 'userRole'},
            {name: 'companyName', title: 'Company', sortField: 'companyName'},
            {name: '__component:user-actions', title: 'Actions'}
          ],
          sortOrder: [{
            field: 'userName',
            direction: 'asc'
          }]
        }
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
      async createUser () {
        this.$validator.validateAll();

        if(this.formFields.valid()){
          try{
            let {data} = await this.$http.post('/api/users', {...this.form});
            this.$refs.table.reload();
            this.$store.dispatch('notify', {type: 'success', text: `Successfully created User ${data.name}`})
            this.resetForm();
          } catch (e) {
            this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
            console.log(e);
          }
          this.closeModal();
        }
      },
    }
  }
</script>
