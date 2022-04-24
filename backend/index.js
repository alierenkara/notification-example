const express = require("express")
const cors = require("cors")
const webpush = require("web-push")
const bodyParser = require("body-parser")

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//DB'de tutulması gerekir. Subscribers tablosu gibi düşünülebilir.
const subscribers = []

//Kendi keyleriniz buraya eklenmelidir.
const vapidKeys = {
  publicKey: "",
  privateKey: ""
}

webpush.setVapidDetails(
  "mailto:ali.erenkara@protoyazilim.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get("/public-key", (req, res) => {
  res.json({
    publicKey: vapidKeys.publicKey
  })
})

app.post("/subscribe", (req, res) => {
  const { subscription, userId } = req.body

  subscribers.push({
    userId,
    subscription
  })

  res.json({
    isSuccess: true,
    message: "Suscribed successfully"
  })
})

app.post("/send-notification", (req, res) => {
  const { userId, notification } = req.body

  subscribers.map((sub) => {
    if (sub && sub.userId === userId) {
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body
      })

      webpush
        .sendNotification(sub.subscription, payload)
        .then(() => {
          res.json({
            isSuccess: true,
            message: "Notification sent successfully"
          })
        })
        .catch((err) => {
          res.json({
            isSuccess: false,
            message: err
          })
        })
    } else {
      res.json({
        isSuccess: false,
        message: "Subscriber not found"
      })
    }
  })
})
