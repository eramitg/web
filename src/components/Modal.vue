<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="modal is-active" v-show="active">
      <div class="modal-background" @click="close"></div>
      <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
        <component :is="form ? 'form' : 'div'" class="modal-card" v-show="active" @submit.prevent="submit">
          <header class="modal-card-head">
            <p class="modal-card-title">{{title}}</p>
          </header>
          <section class="modal-card-body">
            <slot></slot>
          </section>
          <footer class="modal-card-foot" v-if="$slots['footer']">
            <slot name="footer"></slot>
          </footer>
        </component>
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
      },
      form: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      close: function (event){
        this.$emit('close', false)
      },
      submit(event){
        this.$emit('submit')
      }
    },
  }
</script>
