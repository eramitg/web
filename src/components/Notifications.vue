<template>
  <div class="snackbar">
    <div v-for="notification in notifications"
         class="alert"
         :class="notification.type ? `alert-${notification.type}` : 'alert-info'" role="alert">
      {{notification.text}}
    </div>
  </div>
</template>

<script>
  import notification from '../stores/notification';

  export default {
    data(){
      return {
        notifications: notification.state
      }
    }
  }
</script>

<style>
  .snackbar{
    position: fixed;
    min-width: 250px;
    margin-left: -125px;
    left: 50%;
    bottom: 0;
    text-align: center;
    z-index: 1;
  }
</style>