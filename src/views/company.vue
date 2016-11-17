<template>
  <div>
    <form-select v-model="test" label="Test" :options="['USER', 'ADMIN']"></form-select>
    {{test}}
  </div>
</template>

<script>
  import FormSelect from '../components/FormSelect.vue';
  export default {
    components: {
      FormSelect
    },
    data(){
      return {
        test: 'USER',
      }
    }
  }
</script>