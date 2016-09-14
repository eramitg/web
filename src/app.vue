<template>
<div>
    <div class="navbar navbar-default navbar-inverse">
        <div class="container">
            <center>
                <div class="navbar-collapse collapse" id="navbar-main">
                    <ul class="nav navbar-nav">
                    <li><img class="pad-top" src="assets/logo.png"></li>
                        <li><router-link to="/">Dashboard</router-link>
                        </li>
                        <li><router-link to="/user">Usermanagement</router-link>
                        </li>
                    </ul>
                    <div id="login">
                        <login></login>
                    </div>
                </div>
            </center>
        </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
</div>
</template>

<style>
    .pad-top {
      padding-top: 10px;
    }
</style>