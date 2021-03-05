const test = {
  data() {
    return {
      seen: true
    }
  }
}

Vue.createApp(test).mount('#seentest')