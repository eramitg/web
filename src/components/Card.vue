<template>
  <notification class="box" :type="type">
    <slot></slot>
  </notification>
</template>

<script>
  import Notification from './Notification.vue';
  export default{
    components: {
      Notification
    },
    props: {
      type: String
    }
  }
</script>
