<template>
  <div class="snackbar">
    <div v-for="notification in notifications"
         class="alert alert-dismissible"
         :class="notification.type ? `alert-${notification.type}` : 'alert-info'" role="alert">
      <button type="button" class="close" @click="removeClicked(notification)"><span aria-hidden="true">&times;</span></button>
      {{notification.text}}
    </div>
  </div>
</template>

<script>
  import store from '../stores/notification';

  export default {
    data(){
      return {
        notifications: store.state
      }
    },
    methods: {
      removeClicked: function(notification){
        store.removeNotification(notification);
      }
    }
  }
</script>

<style scoped>
  .snackbar{
    position: fixed;
    min-width: 250px;
    max-width: 250px;
    margin-left: -125px;
    left: 50%;
    bottom: 0;
    text-align: center;
    z-index: 1;
  }
</style>