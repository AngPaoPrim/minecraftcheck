const express = require("express")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())

let status = {
  online: false,
  players: 0,
  maxPlayers: 20,
  playerList: []
}

let command = "none"
let lastUpdate = Date.now()

// 🔥 รับ status จาก plugin
app.post("/status", (req, res) => {
  console.log("🔥 RECEIVED:", req.body)

  // กัน field หาย + merge ปลอดภัย
  status = {
    ...status,
    ...req.body
  }

  lastUpdate = Date.now()
  res.sendStatus(200)
})

// 🔥 frontend ดู status
app.get("/status", (req, res) => {
  const alive = (Date.now() - lastUpdate) < 60000 // 🔥 เพิ่มจาก 15s → 60s

  res.json({
    ...status,
    online: status.online && alive
  })
})

// players
app.get("/players", (req, res) => {
  res.json(status.playerList || [])
})

// command system
app.post("/cmd", (req, res) => {
  command = req.body.cmd
  console.log("Command from web:", command)
  res.sendStatus(200)
})

app.get("/cmd", (req, res) => {
  res.send(command)
  command = "none"
})

// web panel
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT)
})
