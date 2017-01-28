<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Company
        </h1>
        <hr>
        <div v-for="item in json">
          <form-select
            v-if="item.type == 'select'"
            v-model="item.value"
            :label="item.label"
            :options="item.options"
            horizontal
          />
          <form-input
            v-else
            v-model="item.value"
            :label="item.label"
            :type="item.type"
            horizontal
          />
        </div>
        <button type="button" class="button is-primary" @click="save">Save</button>
        <textarea v-model="json"></textarea>
      </article>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import FormInput from '../components/FormInput.vue';
  import FormSelect from '../components/FormSelect.vue';
  export default {
    components: {
      FormInput,
      FormSelect
    },
    async beforeRouteEnter(to, from, next) {
      let {data} = await axios.get("/api/v1/company/admin/company");
      next(vm => vm.$data.company = data);
    },
    data() {
      return {
        company: null,
      }
    },
    computed: {
      json: {
        get() {
          try {
            return this.company ? JSON.parse(window.atob(this.company.info)) : [];
          } catch(e){
            return [];
          }
        },
        set(newValue) {
          this.company.info = window.btoa(newValue);
        }
      }
    },
    methods: {
      async save() {
        try{
          let {data} = await axios.put('/api/v1/company/admin/update', {...this.company});
          this.$store.dispatch('notify', {type: 'success', text: 'Successfully updated Settings'})
        } catch (e) {
          this.$store.dispatch('notify', {type: 'danger', text: e.data.message})
          console.log(e);
        }
      }
    }
  }
</script>
