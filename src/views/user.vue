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
        <data-table
          ref="vuetable"
          url="/api/users"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
        >
          <template slot="actions" scope="props">
            <button class="button is-primary" @click="editUser(props.rowData)"><i class="fa fa-pencil"></button>
            <button class="button is-danger" @click="deleteUser(props.rowData)"><i class="fa fa-trash"></button>
          </template>
        </data-table>
      </article>
    </div>

    <modal :active="showModal" title="Create/Edit User" @close="closeModal" @submit="createUpdateUser" form>
      <form-input v-model="form.username" label="Username" placeholder="Name" v-validate="'required'" name="username" :err="errors.first('username')" />
      <form-input v-if="form.id === null" v-model="form.password" label="Password" placeholder="Password" type="password" v-validate="'required'" name="password" :err="errors.first('password')"/>
      <form-select v-model="form.role" label="Role" :options="['USER', 'ADMIN']"/>
      <form-select v-if="$store.getters.user.role == 'SUPER'" v-model.number="form.companyId" label="Company" :options="companyOptions"/>
      <button slot="footer" type="submit" class="button is-primary" @click.prevent="createUpdateUser">Save changes</button>
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
  import store from '../store'

  export default {
    components: {
      DataTable,
      Modal,
      FormInput,
      FormSelect
    },
    async beforeRouteEnter (to, from, next) {
      try {
        if (store.getters.user.role === 'SUPER') {
          let {data} = await Vue.http.get('/api/v1/company/companies')
          next(vm => {
            vm.$data.companies = data
          })
        } else {
          next()
        }
      } catch (e) {
        next()
      }
    },
    data () {
      return {
        showModal: false,
        companies: null,
        form: {
          id: null,
          username: '',
          password: '',
          role: 'USER',
          companyId: 0
        },
        table: {
          columns: [
            {name: 'userName', title: 'Name', sortField: 'userName'},
            {name: 'userRole', title: 'Role', sortField: 'userRole'},
            {name: 'companyName', title: 'Company', sortField: 'companyName'},
            {name: '__slot:actions', title: 'Actions', dataClass: 'has-text-centered'}
          ],
          sortOrder: [{
            field: 'userName',
            direction: 'asc'
          }]
        }
      }
    },
    computed: {
      companyOptions () {
        return this.companies
        ? this.companies.map(item => ({label: item.name, value: item.ID}))
        : []
      }
    },
    methods: {
      closeModal () {
        this.showModal = false
        // reset, when the modal is no longer visible, fix validation flickering
        Vue.nextTick(() => this.resetForm())
      },
      resetForm () {
        this.form = {
          id: null,
          username: '',
          password: '',
          role: 'USER',
          companyId: 0
        }
        // validation has to first happen, so that it can be reset
        Vue.nextTick(() => this.errors.clear())
      },
      async createUpdateUser () {
        try {
          let success = false
          if (this.form.id == null) {
            success = await this.$validator.validateAll()
          } else {
            success = await this.$validator.validateAll({
              username: this.form.username
            })
          }
          if (success) {
            if (this.form.id === null) {
              this.createUser()
            } else {
              this.updateUser()
            }
            this.closeModal()
          }
        } catch (e) {
          console.log(e)
        }
      },
      async createUser () {
        try {
          let {data} = await this.$http.post('api/users', {
            username: this.form.username,
            password: this.form.password,
            role: this.form.role,
            companyId: this.form.companyId
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully created User ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
        }
      },
      async updateUser () {
        try {
          let {data} = await this.$http.put(`/api/users/${this.form.id}`, {...this.form})
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully updated User ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
        }
      },
      async deleteUser ({userID, userName}) {
        if (userID > 0) {
          try {
            await this.$store.dispatch('confirm')
            let {data} = await this.$http.delete(`/api/users/${userID}`)
            this.$refs.vuetable.reload()
            this.$store.dispatch('notify', {type: 'success', text: `Successfully deleted User ${data.name}`})
          } catch (e) {
            // Notification for exception is created globally
            this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
          }
        }
      },
      editUser ({userID, userName, userRole, companyID}) {
        this.form.id = userID
        this.form.username = userName
        this.form.role = userRole
        this.form.companyId = companyID
        this.showModal = true
      }
    }
  }
</script>
