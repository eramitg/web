<template>
  <form>
    <div class="control is-horizontal">
      <div class="control-label">
        <label class="label">Username</label>
      </div>
      <div class="control is-grouped">
        <p class="control is-expanded">
          <input v-model="user.username" class="input" type="text" placeholder="Name">
        </p>
      </div>
    </div>

    <div class="control is-horizontal">
      <div class="control-label">
        <label class="label">Password</label>
      </div>
      <div class="control is-grouped">
        <p class="control is-expanded">
          <input v-model="user.password" class="input" type="password" placeholder="Password">
        </p>
      </div>
    </div>

    <div class="control is-horizontal">
      <div class="control-label">
        <label class="label">Role</label>
      </div>
      <div class="control">
        <div class="select is-fullwidth">
          <select>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>
    </div>
    <div class="control is-horizontal">
      <div class="control-label">
        <label class="label">Question</label>
      </div>
      <div class="control">
        <textarea class="textarea" placeholder="Explain how we can help you"></textarea>
      </div>
    </div>
  </form>
</template>

<script>
  export default{
    props: {
      user: {
        type: Object,
        required: true
      }
    },
  }

</script>
