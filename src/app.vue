<template>
    <div class="container body">
        <div class="main_container">
            <div class="col-md-3 left_col">
                <div class="left_col scroll-view">
                    <div class="navbar nav_title">
                        <a href="index.html" class="site_title">
                            <div class="logo"></div>
                        </a>
                    </div>
                    <div class="clearfix"></div>
                    <br>
                    <!-- sidebar menu -->
                    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                        <div class="menu_section active">
                            <ul class="nav side-menu" style="">
                                <li>
                                    <router-link to="/"><i class="fa fa-home"></i>Dashboard</router-link>
                                </li>
                                <li>
                                    <router-link to="/shipment"><i class="fa fa-paper-plane"></i>Shipment</router-link>
                                </li>
                                <li v-if="isAdminOrSuper">
                                    <router-link to="/user"><i class="fa fa-users"></i>User Management</router-link>
                                </li>
                                <li v-if="isAdminOrSuper">
                                    <router-link to="/company"><i class="fa fa-cog"></i>Company Management
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- /sidebar menu -->
                </div>
            </div>
            <!-- top navigation -->
            <div class="top_nav">
                <div class="nav_menu">
                    <nav class="" role="navigation">
                        <div class="nav toggle">
                            <a id="menu_toggle"><i class="fa fa-bars"></i></a>
                        </div>
                        <login></login>
                    </nav>
                </div>
            </div>
            <!-- /top navigation -->
            <!-- page content -->
            <div class="right_col" role="main">
                <router-view></router-view>
            </div>
            <!-- /page content -->
            <!-- footer content -->
            <footer>
                <div class="clearfix"></div>
            </footer>
            <!-- /footer content -->
        </div>
    </div>
</template>
<script>
    import auth from './auth.js'
    export default {
        mounted() {
            require("./assets/gentelella/js/custom.js");
            require("./assets/gentelella/css/custom.css");
            require("font-awesome-webpack");
            require("./assets/css/app.css")
        },
        data() {
            return {
                isAdminOrSuper: auth.token() && auth.role() === 'ADMIN' || auth.role() === 'SUPER'
            }
        }
    }
</script>