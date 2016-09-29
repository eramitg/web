<template>
  <div class="container body" style="margin: 0;padding: 0;width: 100%;">
        <div class="main_container">
          <div class="col-md-3 left_col" style="height: 100%;">
            <div class="left_col scroll-view">
              <div class="navbar nav_title" style="border: 0;">
                <a href="index.html" class="site_title">
                </a>
              </div>

              <div class="clearfix"></div>

              <br>

              <!-- sidebar menu -->
              <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                <div class="menu_section active">
                  <ul class="nav side-menu" style="">
                    <li class="">
                      <router-link to="/"><i class="fa fa-home"></i>Dashboard</router-link>
                    </li>
                    <li>
                      <router-link to="/user"><i class="fa fa-users"></i>User Management</router-link>
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
          <div class="right_col" role="main" style="min-height: 1770px;">
            <div class="row">
              <router-view></router-view>
            </div>
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
