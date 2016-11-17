<template>
  <form>
    <form-input v-model="user.username" label="Username" placeholder="Name"/>
    <form-input v-model="user.password" label="Password" placeholder="Password" type="password"/>
    <form-select v-model="user.role" label="Role" :options="['USER', 'ADMIN']"/>
  </form>
</template>

<script>
  import FormInput from '../components/FormInput.vue';
  import FormSelect from '../components/FormSelect.vue';
  export default{
    components: {
      FormInput,
      FormSelect
    },
    props: {
      user: {
        type: Object,
        required: true
      }
    },
  }

</script>
