<template>
  <section class="hero is-fullheight is-dark">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third is-offset-one-third">
            <form class="box" @submit="onSubmit">
              <figure class="image">
                <img src="../assets/images/logo.svg">
              </figure>
              <hr>
              <form-input
                label="Email"
                v-model="mail"
                name="email"
                icon="fa fa-user-circle"
                v-validate="'required|email'"
                :err="errors.first('email')"
              />
              <form-input
                label="Password"
                type="password"
                v-model="password"
                name="password"
                icon="fa fa-lock"
                v-validate="'required'"
                :err="errors.first('password')"
              />
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
  import FormInput from '../components/FormInput.vue'
  export default {
    components: {
      FormInput
    },
    data () {
      return {
        mail: '',
        password: '',
        loading: false
      }
    },
    methods: {
      async onSubmit () {
        try {
          await this.$validator.validateAll()
          this.loading = true
          try {
            await this.$store.dispatch('login', {
              mail: this.mail,
              password: this.password
            })
            const {redirect} = this.$route.query
            this.$router.push(redirect || '/')
          } catch ({response}) {
            this.$store.dispatch('notify', {text: response.data, type: 'danger'})
          }
          this.loading = false
        } catch (e) {

        }
      },
      reset () {
        this.mail = ''
        this.password = ''
      }
    }
  }
</script>
