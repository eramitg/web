<template>
  <div class="snackbar">
    <transition-group
            enter-active-class="animated slideInUp"
            leave-active-class="animated slideOutDown"
            name="list" tag="p">
      <Notification v-for="notification in list" @close="remove(notification)" :color="notification.color" :key="notification">
        {{notification.text}}
      </Notification>
    </transition-group>
  </div>
</template>

<script>
  import Notification from '../components/Notification.vue';

  export default {
    components: {
      Notification
    },
    computed: {
      list(){
        return this.$store.state.notification.list;
      }
    },
    methods: {
      remove: function(notification){
        this.$store.commit('removeNotification', notification);
      }
    }
  }
</script>

<style scoped>
  .snackbar{
    position: fixed;
    min-width: 300px;
    max-width: 300px;
    margin-left: -150px;
    left: 50%;
    bottom: 0;
    text-align: center;
    z-index: 1;
  }
  .list-move {
    transition: all 0.7s;
  }
</style>