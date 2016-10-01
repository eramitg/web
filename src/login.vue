<template>
    <div>
        <ul class="nav navbar-nav navbar-right">
            <li v-if="authenticated">
                <a class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <i class="glyphicon glyphicon-user"></i>
                    {{credentials.role}} {{credentials.username}} / {{credentials.company}}
                    <span class=" fa fa-angle-down"></span>
                </a>
                <ul class="dropdown-menu dropdown-usermenu pull-right">
                    <li><a @click="logout()" href="/"><i class="fa fa-sign-out pull-right"></i> Sign Out</a></li>
                    </li>
                    <li id="login" class="form-inline" v-if="!authenticated">
                        <a>
                            <div class="form-group">
                                <input type="text" class="form-control" name="username"  v-model="credentials.username" placeholder="Username">
                                <input type="password" class="form-control" v-model="credentials.password" name="password" placeholder="Password">
                            </div>
                            <button class="btn btn-primary" @click="submit()">Sign In</button>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
    import auth from './auth.js'
    export default {
        data() {
            return {
                credentials: {
                    role: auth.role().charAt(0).toUpperCase() + auth.role().slice(1).toLowerCase(),
                    username: auth.userName() != "n/a" ? auth.userName() : '',
                    password: '',
                    company: auth.companyName()
                },
                error: '',
                authenticated: auth.token() != "n/a" && auth.role() !== 'USER'
            }
        },
        methods: {
            async submit() {
                var credentials = {
                    username: this.credentials.username,
                    password: this.credentials.password
                };
                try {
                    let result = await auth.login(credentials);
                    if (result.token) {
                        this.authenticated = true;
                        this.error = '';
                        this.$router.go('/')
                    } else {
                        this.error = "no token";
                    }
                } catch (err) {
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