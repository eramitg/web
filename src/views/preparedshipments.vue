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
          url="/api/preparedshipments"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
        ></data-table>

      </article>
    </div>
    <modal :active="showModal" title="Create/Edit Shipment" @close="closeModal" form>
      <form-input v-model="form.username" label="Username" placeholder="Name" v-validate data-vv-rules="required" name="username" :err="errors.first('username')" />
      <form-input v-model="form.password" label="Password" placeholder="Password" type="password" v-validate data-vv-rules="required" name="password" :err="errors.first('password')"/>
      <form-select v-model="form.role" label="Role" :options="['USER', 'ADMIN']"/>
      <button slot="footer" type="submit" class="button is-primary" @click.prevent="createUser">Save changes</button>
      <button slot="footer" type="button" class="button" @click.prevent="closeModal">Cancel</button>
    </modal>
  </div>
</template>

<script>
import DataTable from '../components/DataTable';

import FormInput from '../components/FormInput.vue';
import FormSelect from '../components/FormSelect.vue';
import Modal from '../components/Modal.vue';

export default {
  components: {
    DataTable,
    Modal,
    FormInput,
    FormSelect
  },
  data() {
    return {
      showModal: false,
      form: {
        username: '',
        password: '',
        role: 'USER'
      },
      table: {
        columns: [
          {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
          {name: 'receiverCompany', title: this.$t('rcv_comp'), sortField: 'receiverCompany'},
        ],
        sortOrder: [{
          field: 'tnt_number',
          direction: 'asc'
        }]
      },
    }
  },
  methods: {
    closeModal(){
      this.showModal = false;
    }
  }
}
</script>
