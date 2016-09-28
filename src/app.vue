<template>
<div>
    <div class="navbar navbar-default navbar-inverse">
        <div class="container">
                <div class="navbar-collapse collapse" id="navbar-main">
                    <ul class="nav navbar-nav">
                    <li><img class="pad-top" src="assets/logo.png"></li>
                        <li><router-link to="/">Dashboard</router-link></li>
                        <li v-if="authenticated"><router-link to="/user">Usermanagement</router-link></li>
                    </ul>
                    <div id="login">
                        <login></login>
                    </div>
                </div>
        </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
</div>
</template>

<script>
    import auth from './auth.js'
    export default {
        data: {
            role: auth.role(),
            authenticated: auth.token() && auth.role() !== 'USER'
        }
    }
</script>

<style>
    .pad-top {
      padding-top: 10px;
    }
</style>