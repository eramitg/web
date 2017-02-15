<template>
  <section class="hero is-fullheight is-dark">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third is-offset-one-third has-text-centered">
            <h1 class="error-number">404</h1>
            <p>Sorry but we couldn't find this page</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import '../variables';

  .error-number{
    color: $text-strong;
    font-size: 90px;
    line-height: 90px;
    margin: 20px 0;
    font-weight: $weight-normal;
  }
</style>
