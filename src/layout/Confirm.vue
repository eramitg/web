<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="modal is-active" v-show="deferred">
      <div class="modal-background" @click="onCancel"></div>
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <div class="modal-content" v-show="deferred">
        <div class="card is-fullwidth">
          <header class="card-header">
            <p class="card-header-title">
              Confirm
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              Are you sure that oyu want to <strong>delete</strong> this item?
            </div>
          </div>
          <footer class="card-footer">
            <button class="button is-danger is-fullwidth borderless" @click="onConfirm">Delete</button>
            <button class="button is-fullwidth borderless" @click="onCancel">Cancel</button>
          </footer>
        </div>
      </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    computed: {
      deferred () {
        return this.$store.state.confirm.deferred;
      }
    },
    methods: {
      onConfirm(){
        if(this.deferred){
          this.deferred.resolve();
        }
        this.$store.commit('setDeferred', null)
      },
      onCancel(){
        if(this.deferred){
          this.deferred.reject();
        }
        this.$store.commit('setDeferred', null)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .borderless{
    border: none;
    border-radius: 0;
  }
</style>