<template>
<div>
<form method="post" id="create-form">
    Username: <input type="text" name="username"><br>
    Password: <input type="password" name="password"><br>
</form>
<button @click="submit()">Create User</button>
</div>
</template>

<script>
import auth from './auth.js'
export default {
    data() {
      return {
        error: '',
      }
    },
    methods: {
      submit() {
        auth.test();
      },
      dismiss() {
        this.error = '';
      }
    }
  }
</script>