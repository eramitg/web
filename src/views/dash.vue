<template>
  <div>
    <nav class="level">
      <div class="level-item has-text-centered">
        <p class="heading">Tweets</p>
        <p class="title">3,456</p>
      </div>
      <div class="level-item has-text-centered">
        <p class="heading">Following</p>
        <p class="title">123</p>
      </div>
      <div class="level-item has-text-centered">
        <p class="heading">Followers</p>
        <p class="title">456K</p>
      </div>
      <div class="level-item has-text-centered">
        <p class="heading">Likes</p>
        <p class="title">789</p>
      </div>
    </nav>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <chart :type="'line'" :data="pieData" :options="options"></chart>
        </article>
      </div>
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <chart :type="'doughnut'" :data="pieData" :options="options"></chart>
        </article>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <v-client-table :data="tableData" :columns="columns" :options="options"></v-client-table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from '../components/Chart.vue';


  export default {
    components: {
      Chart
    },
    data(){
      return {
        columns:['id','name','age'],
        tableData: [
          {id:1, name:"John",age:"20"},
          {id:2, name:"Jane",age:"24"},
          {id:3, name:"Susan",age:"16"},
          {id:4, name:"Chris",age:"55"},
          {id:5, name:"Dan",age:"40"}
        ],
        labels: ['Sleeping', 'Designing', 'Coding', 'Cycling'],
        data: [20, 40, 5, 35],
        options: {
          legend: {
            display: false
           }
        },
        backgroundColor: [
          '#1fc8db',
          '#fce473',
          '#42afe3',
          '#ed6c63'
        ],
       }
    },
    computed: {
      pieData () {
      return {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor
        }]
       }
      },
    }
  }
</script>