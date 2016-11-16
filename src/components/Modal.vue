<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="modal is-active" v-show="active">
      <div class="modal-background" @click="close"></div>
      <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
        <div class="modal-card" v-show="active">
          <header class="modal-card-head">
            <p class="modal-card-title">{{title}}</p>
            <button class="delete" @click="close"></button>
          </header>
          <section class="modal-card-body">
            <slot></slot>
          </section>
          <footer class="modal-card-foot" v-if="$slots['footer']">
            <slot name="footer"></slot>
          </footer>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      active: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    methods: {
      close: function (event){
        this.$emit('close', false)
      }
    },
  }
</script>