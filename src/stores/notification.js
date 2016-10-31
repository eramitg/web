

export default {
  state: [{text: 'danger', type: 'danger'}],
  addNotification: function (text, type="info", timeout=true, delay=2000) {
    let notification = {text, type};
    this.state.push(notification);

    if (timeout){
      setTimeout(() => this.removeNotification(notification), delay);
    }
  },
  removeNotification: function (notification) {
    this.state.remove(notification)
  }
}