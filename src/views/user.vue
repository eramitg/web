<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Users
          <button class="button" @click="clickCreate">
            <span class="fa fa-user-plus"></span>
          </button>
        </h1>
        <hr>
        <data-table
          ref="vuetable"
          url="users"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
        >
          <template slot="actions" scope="props">
            <button class="button is-primary" @click="clickUpdate(props.rowData)"><i class="fa fa-pencil"></button>
            <button class="button is-info" @click="clickChangePw(props.rowData)"><i class="fa fa-lock"></button>
            <button class="button is-danger" @click="deleteUser(props.rowData)"><i class="fa fa-trash"></button>
          </template>
        </data-table>
      </article>
    </div>

    <modal :active="showModal" title="Create/Edit User" @close="closeModal" @submit="submitForm" form>
      <form-input v-if="mode != 'PASSWORD'" v-model="form.username" label="Username" placeholder="Name" v-validate="'required'" name="username" :err="errors.first('username')" />
      <form-input v-if="mode != 'UPDATE'" v-model="form.password" label="Password" placeholder="Password" type="password" v-validate="'required'" name="password" :err="errors.first('password')"/>
      <form-input v-if="mode != 'UPDATE'" v-model="form.password2" label="Repeat Password" placeholder="Password" type="password" v-validate="'required|confirmed:password'" name="password2" :err="errors.first('password2')"/>
      <form-select v-if="mode != 'PASSWORD'" v-model="form.role" label="Role" :options="['USER', 'ADMIN']"/>
      <form-select v-if="$store.getters.user.role == 'SUPER' && mode != 'PASSWORD'" v-model.number="form.companyId" label="Company" :options="companyOptions" v-validate="'required'" name="company" :err="errors.first('company')"/>
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
          let {data} = await Vue.http.get('v1/company/companies')
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
        mode: null,
        form: {
          id: null,
          username: '',
          password: '',
          password2: '',
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
        Vue.nextTick(() => {
          this.resetForm()
          this.mode = null
        })
      },
      resetForm () {
        this.form = {
          id: null,
          username: '',
          password: '',
          passowrd2: '',
          role: 'USER',
          companyId: 0
        }
        // validation has to first happen, so that it can be reset
        Vue.nextTick(() => this.errors.clear())
      },
      async submitForm () {
        try {
          let success = false
          switch (this.mode) {
            case 'CREATE':
              success = await this.$validator.validateAll()
              break
            case 'UPDATE':
              success = await this.$validator.validateAll({
                username: this.form.username
              })
              break
            case 'PASSWORD':
              success = await this.$validator.validateAll({
                password: this.form.password,
                password2: this.form.password2
              })
              break
            default:
              success = false
          }

          if (success) {
            switch (this.mode) {
              case 'CREATE':
                this.createUser()
                break
              case 'UPDATE':
                this.updateUser()
                break
              case 'PASSWORD':
                this.changePw()
                break
              default:
                this.closeModal()
            }
            this.closeModal()
          }
        } catch (e) {
          console.log(e)
        }
      },
      async createUser () {
        try {
          let {data} = await this.$http.post('users', {
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
          let {data} = await this.$http.put(`v1/company/admin/updateuser/${this.form.id}`, {
            userName: this.form.username,
            userRole: this.form.role,
            companyID: this.form.companyId
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully updated User ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
        }
      },
      async changePw () {
        try {
          let {data} = await this.$http.put(`v1/company/admin/changepw/${this.form.id}`, {
            username: this.form.username,
            password: this.form.password
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully changed password for User ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
        }
      },
      async deleteUser ({userID, userName}) {
        if (userID > 0) {
          try {
            await this.$store.dispatch('confirm')
            let {data} = await this.$http.delete(`users/${userID}`)
            this.$refs.vuetable.reload()
            this.$store.dispatch('notify', {type: 'success', text: `Successfully deleted User ${data.name}`})
          } catch (e) {
            // Notification for exception is created globally
            this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
          }
        }
      },
      clickCreate () {
        this.mode = 'CREATE'
        this.showModal = true
      },
      clickUpdate ({userID, userName, userRole, companyID}) {
        this.mode = 'UPDATE'
        this.form.id = userID
        this.form.username = userName
        this.form.role = userRole
        this.form.companyId = companyID
        this.showModal = true
      },
      clickChangePw ({userID, userName}) {
        this.mode = 'PASSWORD'
        this.form.id = userID
        this.form.username = userName
        this.showModal = true
      }
    }
  }
</script>
