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
          url="users?nested=1"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
          :query="table.query"
        >
          <template slot="actions" scope="props">
            <button class="button is-primary" @click="clickUpdate(props.rowData)"><i class="fa fa-pencil"/></button>
            <button class="button is-info" @click="clickChangePw(props.rowData)"><i class="fa fa-lock"/></button>
            <button class="button is-danger" @click="deleteUser(props.rowData)"><i class="fa fa-trash"/></button>
          </template>
        </data-table>
      </article>
    </div>

    <modal :active="showModal" title="Create/Edit User" @close="closeModal" @submit="submitForm" form>
      <form-input v-if="mode != 'PASSWORD'" v-model="form.firstname" label="Firstname" placeholder="Firstname" v-validate="{ rules: {required: true}, arg: 'form.firstname' }" name="firstname" :err="errors.first('firstname')" />
      <form-input v-if="mode != 'PASSWORD'" v-model="form.lastname" label="Lastname" placeholder="Lastname" v-validate="{ rules: {required: true}, arg: 'form.lastname' }" name="lastname" :err="errors.first('lastname')" />
      <form-input v-if="mode != 'PASSWORD'" v-model="form.mail" label="Email" placeholder="Email" v-validate="{ rules: {required: true, email: true}, arg: 'form.mail' }" name="mail" :err="errors.first('mail')" />
      <form-input v-if="mode != 'UPDATE'" v-model="form.password" label="Password" placeholder="Password" type="password" v-validate="{ rules: {required: true}, arg: 'form.password' }" name="password" :err="errors.first('password')"/>
      <form-input v-if="mode != 'UPDATE'" v-model="form.password2" label="Repeat Password" placeholder="Password" type="password" v-validate="{ rules: {confirmed: 'password'}, arg: 'form.password2' }" name="password2" :err="errors.first('password2')"/>
      <form-select v-if="mode != 'PASSWORD'" v-model.number="form.role" label="Role" :options="[{label: 'USER', value: 0}, {label: 'ADMIN', value:1}, {label: 'SUPER', value: 2}]"/>
      <form-select v-if="$store.getters.hasRole == 'SUPER' && mode != 'PASSWORD'" v-model.number="form.companyID" label="Company" :options="companyOptions" v-validate="'required'" name="company" :err="errors.first('company')"/>
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
        if (store.getters.hasRole === 'SUPER') {
          let {data} = await Vue.http.get('companies', {params: {sort: 'name|asc'}})
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
          firstname: '',
          lastname: '',
          mail: '',
          password: '',
          passowrd2: '',
          role: 0,
          companyID: 0
        },
        table: {
          columns: [
            {name: 'mail', title: 'Email', sortField: 'mail'},
            {name: 'firstname', title: 'Firstname', sortField: 'firstname'},
            {name: 'lastname', title: 'Lastname', sortField: 'lastname'},
            {name: 'role', title: 'Role', sortField: 'role', callback: 'roleAsString'},
            {name: 'company.name', title: 'Company', sortField: 'company_id'},
            {name: '__slot:actions', title: 'Actions', dataClass: 'has-text-centered'}
          ],
          sortOrder: [{
            field: 'mail',
            direction: 'asc'
          }],
          query: [
            {name: 'Email', field: 'mail'},
            {name: 'Firstname', field: 'firstname'},
            {name: 'Lastname', field: 'lastname'},
            {name: 'Role', field: 'role', options: [{label: 'USER', value: 0}, {label: 'ADMIN', value: 1}, {label: 'SUPER', value: 2}]}
          ]
        }
      }
    },
    computed: {
      companyOptions () {
        return this.companies && this.companies.data
        ? this.companies.data.map(item => ({label: item.name, value: item.id}))
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
          firstname: '',
          lastname: '',
          mail: '',
          password: '',
          passowrd2: '',
          role: 0,
          companyID: 0
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
                mail: this.form.mail
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
            firstname: this.form.firstname,
            lastname: this.form.lastname,
            mail: this.form.mail,
            password: this.form.password,
            role: this.form.role,
            companyID: this.form.companyID
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully created User ${data.name}`})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data})
        }
      },
      async updateUser () {
        try {
          let {data} = await this.$http.put(`users/${this.form.id}`, {
            firstname: this.form.firstname,
            lastname: this.form.lastname,
            mail: this.form.mail,
            role: this.form.role,
            companyID: this.form.companyID
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully updated User ${data.firstname} ${data.lastname}`})
        } catch ({response}) {
          this.$store.dispatch('notify', {type: 'danger', text: response.data})
        }
      },
      async changePw () {
        try {
          let {data} = await this.$http.put(`v1/company/admin/changepw/${this.form.id}`, {
            username: this.form.username,
            password: this.form.password
          })
          this.$refs.vuetable.reload()
          this.$store.dispatch('notify', {type: 'success', text: `Successfully changed password for User ${data}`})
        } catch ({response}) {
          this.$store.dispatch('notify', {type: 'danger', text: response.data})
        }
      },
      async deleteUser ({id, firstname, lastname}) {
        if (id > 0) {
          try {
            await this.$store.dispatch('confirm')
            await this.$http.delete(`users/${id}`)
            this.$refs.vuetable.reload()
            this.$store.dispatch('notify', {type: 'success', text: 'Successfully deleted User'})
          } catch ({response}) {
            // Notification for exception is created globally
            this.$store.dispatch('notify', {type: 'danger', text: response.data})
          }
        }
      },
      clickCreate () {
        this.mode = 'CREATE'
        console.log(this.companyOptions[0])
        if (this.companyOptions && this.companyOptions.length > 0) {
          this.form.companyID = this.companyOptions[0].value
        }
        this.showModal = true
      },
      clickUpdate ({id, firstname, lastname, mail, role, companyID}) {
        this.mode = 'UPDATE'
        this.form.id = id
        this.form.firstname = firstname
        this.form.lastname = lastname
        this.form.mail = mail
        this.form.role = role
        this.form.companyID = companyID
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
