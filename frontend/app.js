const API_URL = "http://127.0.0.1:3000"
const USER_ID = 1

window.addEventListener("load", () => {
  navigator.serviceWorker.register("service-worker.js")

  navigator.serviceWorker.ready.then(async (registration) => {
    const notificationPermission = await Notification.requestPermission()

    if (notificationPermission === "granted") {
      subscribe(registration)
    } else {
      console.log("Not allowed to send notification")
    }
  })
})

const subscribe = async (registration) => {
  const publicKeyResponse = await fetch(`${API_URL}/public-key`)
  const { publicKey } = await publicKeyResponse.json()

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey
  })

  fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: USER_ID,
      subscription
    })
  })
}
