<template>
  <section class="hero is-medium">
    <!-- Hero header: will stick at the top -->
    <div class="hero-head">
      <nav class="nav has-shadow">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet" @click="$store.dispatch('TOGGLE_SIDEBAR')">
            <i class="fa fa-bars"></i>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item hero-brand" href="/">
            <img src="../assets/images/logo.svg">
          </a>
        </div>
        <div class="nav-right is-flex"></div>
      </nav>
    </div>
  </section>
</template>