<template>
  <section class="hero is-fullheight is-light is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third is-offset-one-third">
            <h1 class="title">
              Login
            </h1>
            <form class="box">
              <label class="label">Email</label>
              <p class="control">
                <input v-model="username" class="input" type="text" placeholder="username">
              </p>
              <label class="label">Password</label>
              <p class="control">
                <input v-model="password" class="input" type="password" placeholder="password">
              </p>
              <hr>
              <p class="control">
                <button @click.prevent="onSubmit" type="submit" class="button is-primary is-fullwidth" :class="{'is-loading': loading}">Login</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        loading: false
      }
    },
    computed: {
      token(){
        return this.$store.state.auth.token
      }
    },
    methods: {
      async onSubmit(){
        try {
          this.loading = true;
          await this.$store.dispatch('login', {
            username: this.username,
            password: this.password
          })
          const {redirect} = this.$route.query
          this.$router.push(redirect || '/');
          this.loading = false;
        } catch({response}){
          this.loading = false;
        }
      },
      reset(){
        this.username = '';
        this.password = '';
      }
    }
  }
</script>