<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Missing Contracts / TX</h1>
          <hr>
          <data-table
            url="/api/v1/contract/missing"
            :fields="tableMissing.columns"
            :sortOrder="tableMissing.sortOrder"
          >
            <template slot="transaction" scope="props">
              <a v-if="props.rowData.transaction_hash" :href="`https://etherscan.io/tx/data/${props.rowData.transaction_hash}`">
                {{`${props.rowData.transaction_hash.substr(0, 20)}...`}}
              </a>
              <button v-else class="button" @click="contract(props.rowData.id, props.rowData.gid, 'tx')">Report Temp.</button>
            </template>
            <template slot="contract" scope="props">
              <a v-if="props.rowData.contract_address" :href="`https://etherscan.io/tx/data/${props.rowData.contract_address}`">
                {{`${props.rowData.contract_address.substr(0, 20)}...`}}
              </a>
              <button v-else class="button" @click="contract(props.rowData.id, props.rowData.gid, 'contract')">Create Contract</button>
            </template>
            <template slot="cache" scope="props">
              <button class="button" @click="contract(props.rowData.id, props.rowData.gid, 'mined')">Check Mined</button>
            </template>
          </data-table>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Mined Contracts / TX</h1>
          <hr>
          <data-table
            url="/api/v1/contract/mined"
            :fields="tableMined.columns"
            :sortOrder="tableMined.sortOrder"
          >
            <template slot="transaction" scope="props">
              <a v-if="props.rowData.transaction_hash" :href="`https://etherscan.io/tx/data/${props.rowData.transaction_hash}`">
                {{`${props.rowData.transaction_hash.substr(0, 20)}...`}}
              </a>
              <button v-else class="button" @click="contract(props.rowData.id, props.rowData.gid, 'tx')">Report Temp.</button>
            </template>
            <template slot="contract" scope="props">
              <a v-if="props.rowData.contract_address" :href="`https://etherscan.io/tx/data/${props.rowData.contract_address}`">
                {{`${props.rowData.contract_address.substr(0, 20)}...`}}
              </a>
              <button v-else class="button" @click="contract(props.rowData.id, props.rowData.gid, 'contract')">Create Contract</button>
            </template>
          </data-table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
  import DataTable from '../components/DataTable';

  export default {
    components: {
      DataTable
    },
    data(){
      return {
        tableMissing: {
          columns: [
            {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
            {name: 'dateSent', title: this.$t('date_sent'), sortField: 'dateSent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
            {name: '__slot:transaction', title: 'transaction_hash', sortField: 'transaction_hash'},
            {name: '__slot:contract', title: 'contract_address', sortField: 'contract_address'},
            {name: '__slot:cache', title: 'cache_result', sortField: 'cache_result'},
          ],
          sortOrder: [{
            field: 'tntNumber',
            direction: 'asc'
          }]
        },
        tableMined: {
          columns: [
            {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
            {name: 'dateSent', title: this.$t('date_sent'), sortField: 'dateSent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
            {name: '__slot:transaction', title: 'transaction_hash', sortField: 'transaction_hash'},
            {name: '__slot:contract', title: 'contract_address', sortField: 'contract_address'},
          ],
          sortOrder: [{
            field: 'tntNumber',
            direction: 'asc'
          }]
        },
      }
    },
    methods: {
      async contract(pid, gid, type) {
        try {
          let {data} = await this.$http.get(`/api/v1/contract/type/${pid}/${gid}/${type}`);
          this.$store.dispatch('notify', {type: 'success', timeout: false, text: data});
        } catch(e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message});
        }
      }
    }
  }
</script>
