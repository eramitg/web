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

        <nav class="level is-marginless">
          <div class="level-left">
            <div class="level-item">
              <filter-bar></filter-bar>
            </div>
          </div>
          <div class="level-right">
            <vuetable-pagination-info ref="paginationInfo"/>
          </div>
        </nav>
        <vuetable ref="vuetable"
          api-url="/api/preparedshipments"
          :css="css"
          :fields="table.columns"
          :paginationPath="paginationPath"
          :data-path="dataPath"
          :sortOrder="table.sortOrder"
          @vuetable:pagination-data="onPaginationData"
        >
        </vuetable>
        <bulma-pagination ref="pagination" @vuetable-pagination:change-page="onChangePage"/>
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
import tableMixin from '../components/Table/mixin';
import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
import FilterBar from '../components/Table/FilterBar.vue';
import BulmaPagination from '../components/Table/BulmaPagination.vue';

import FormInput from '../components/FormInput.vue';
import FormSelect from '../components/FormSelect.vue';
import Modal from '../components/Modal.vue';

export default {
  mixins: [tableMixin],
  components: {
    Vuetable,
    BulmaPagination,
    VuetablePaginationInfo,
    FilterBar,
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
          field: 'tntNumber',
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
