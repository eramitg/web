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
                </ul>
            </li>

            <li id="login" class="form-inline" v-if="!authenticated">
                <a>
                    <div class="form-group">
                        <input type="text" class="form-control" name="username" v-bind:class="{'parsley-error' : error !== ''}" v-model="credentials.username"
                               placeholder="Username">
                        <input type="password" class="form-control" v-model="credentials.password" v-bind:class="{'parsley-error' : error !== ''}" name="password"
                               placeholder="Password">
                    </div>
                    <button class="btn btn-primary" @click="submit()">Sign In</button>
                </a>
            </li>
        </ul>
        <div id="errordialog" class="modal fade">
            <div class="modal-dialog">
                <div class="alert alert-danger alert-dismissible fade in" role="alert">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">×</span>
                    </button>
                    {{error}}
                </div>
            </div>
        </div>
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
                authenticated: auth.token() != "n/a"
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

                if(this.error !== '') {
                    $('#errordialog').modal('show');
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