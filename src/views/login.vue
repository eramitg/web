<template>
  <section class="hero is-fullheight is-dark">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third is-offset-one-third">
            <div class="column is-12 spacer">
              <figure class="image">
                <img src="../assets/images/logo.svg">
              </figure>
            </div>
            <form class="box" @submit="onSubmit">
              <label class="label">Username</label>
              <p class="control has-icon">
                <input v-validate data-rules="required" name="username" v-model="username" class="input" :class="{'is-danger': errors.has('username')}" type="text" placeholder="username">
                <i class="fa fa-user-circle"></i>
                <span v-show="errors.has('username')" class="help is-danger">{{ errors.first('username') }}</span>
              </p>
              <label class="label">Password</label>
              <p class="control has-icon">
                <input v-validate name="password" data-rules="required" v-model="password" class="input" :class="{'is-danger': errors.has('password')}" type="password" placeholder="password">
                <i class="fa fa-lock"></i>
                <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
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
  import FormInput from '../components/FormInput.vue';
  export default {
    components: {
      FormInput
    },
    data() {
      return {
        username: '',
        password: '',
        usa: '',
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
        this.$validator.validateAll();

        if(this.fields.valid()){
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
        }
      },
      reset(){
        this.username = '';
        this.password = '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .spacer{
    margin-bottom: 20px;
  }
</style>