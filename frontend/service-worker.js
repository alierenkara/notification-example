self.addEventListener("push", (e) => {
  if (e.data) {
    const { title, body } = JSON.parse(e.data.text())

    self.registration.showNotification(title, {
      body
    })
  }
})
