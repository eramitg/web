<template>
  <div v-if="missing && mined">
    <div class="tile is-ancestor" v-if="missing">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="container">
            <h1 class="title">Missing Contracts / TX</h1>
          </div>
          <hr>
          <data-table :data="missing" :columns="missingTable.columns" :options="missingTable.options"></data-table>
        </article>
      </div>
    </div>
    <div class="tile is-ancestor" v-if="mined">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="container">
            <h1 class="title">Mined Contracts / TX</h1>
          </div>
          <hr>
          <data-table :data="mined" :columns="minedTable.columns" :options="minedTable.options"></data-table>
        </article>
      </div>
    </div>
  </div>
  <div v-else>
    OHHHHH CRAPS
  </div>
</template>

<script>
  import axios from 'axios';
  import DataTable from '../components/DataTable.vue';

  export default {
    components: {
      DataTable
    },
    async beforeRouteEnter(to, from, next){
      let missing = await axios.get('/api/v1/contract/missing');
      let mined = await axios.get('/api/v1/contract/mined');
      next(vm => {
        vm.$data.missing = missing.data;
        vm.$data.mined = mined.data;
      })
    },
    data(){
      return {
        missing: null,
        mined: null,
        missingTable: {
          columns: ['tntNumber', 'dateSent', 'transaction_hash', 'contract_address', 'cache_result'],
          options: {
            headings:{
              tntNumber: this.$t('tnt')
            },
            templates: {
              transaction_hash: function(h, row) {
                if(row.transaction_hash){
                  let show = `${row.transaction_hash.substr(0, 20)}...`;
                  let url = `https://etherscan.io/tx/data/${row.transaction_hash}`
                  return <a href={url} >{show}</a>
                } else {
                  return <button class="button">Report Temp.</button>
                }
              },
              contract_address: function(h, row){
                if(row.transaction_hash){
                  let show = `${row.transaction_hash.substr(0, 20)}...`;
                  let url = `https://etherscan.io/tx/data/${row.transaction_hash}`
                  return <a href={url} >{show}</a>
                } else {
                  return <button class="button">Create Contract</button>
                }
              },
              cache_result: function(h, row){
                return <button class="button">Check Mined</button>
              }
            },
          }
        },
        minedTable: {
          columns: ['tntNumber', 'dateSent', 'transaction_hash', 'contract_address'],
          options: {
            headings:{
              tntNumber: i18.t('tnt')
            },
            templates: {
              transaction_hash: function(h, row) {
                if(row.transaction_hash){
                  let show = `${row.transaction_hash.substr(0, 20)}...`;
                  let url = `https://etherscan.io/tx/data/${row.transaction_hash}`
                  return <a href={url} >{show}</a>
                } else {
                  return <button class="button">Report Temp.</button>
                }
              },
              contract_address: function(h, row){
                if(row.transaction_hash){
                  let show = `${row.transaction_hash.substr(0, 20)}...`;
                  let url = `https://etherscan.io/tx/data/${row.transaction_hash}`
                  return <a href={url} >{show}</a>
                } else {
                  return <button class="button">Create Contract</button>
                }
              }
            },
          }
        }
      }
    }
  }
</script>