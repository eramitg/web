<template>
<div>
  <div class="navbar-collapse collapse" id="navbar-main">
              <div class=" navbar-right" role="search" id="login" v-if="authenticated">
              <ul class="nav navbar-nav">
                  <li class="dropdown" id="user-menu">
                      <a href="#" class="dropdown-toggle" data-toggle="dropdown">User: {{credentials.username}} <b class="caret"></b></a>
                      <ul class="dropdown-menu">
                          <li><a href="#" @click="logout()">Sign Out</a></li>
                      </ul>
                  </li>
              </ul>

              </div>
              <div class="navbar-form navbar-right" role="search" id="login" v-if="!authenticated">
                  <div class="form-group">
                      <input type="text" class="form-control" name="username" placeholder="Username" v-model="credentials.username">
                  </div>
                  <div class="form-group">
                      <input type="password" class="form-control" name="password" placeholder="Password" v-model="credentials.password">
                  </div>
                  <button class="btn btn-primary" @click="submit()">Sign In</button>
              </div>
          </div>
          <div class="alert alert-danger" v-if="error">
                  <a href="#" class="close"  @click="dismiss()">&times;</a>
                  <p>{{ error }}</p>
              </div>
          </div>
</template>

<script>
import auth from './auth.js'
export default {
    data() {
      return {
        credentials: {
          username: auth.username(),
          password: ''
        },
        error: '',
        authenticated: auth.checkAuth()
      }
    },
    methods: {
      async submit() {
        var credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        }
        try {
            let result = await auth.login(credentials);
            if(result.token) {
                this.authenticated = true;
                this.error = '';
                this.$router.go('/')
            } else {
                this.error = "no token";
            }
        } catch(err) {
         this.error = err.responseJSON.message;
        }
      },
      dismiss() {
        this.error = '';
      },
      logout() {
        auth.logout()
        this.authenticated = false
      }
    }

  }
</script>