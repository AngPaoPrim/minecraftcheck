const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static("public"))

let status = {
  online: false,
  players: 0,
  maxPlayers: 20,
  playerList: []
}
let command = "none"

app.post("/status", (req, res) => {
  status = req.body
  console.log("Status Update:", status)
  res.sendStatus(200)
})

app.get("/status", (req, res) => {
  res.json(status)
})

app.get("/players", (req, res) => {
  res.json(status.playerList || [])
})

app.post("/cmd", (req, res) => {
  command = req.body.cmd
  console.log("Command from web:", command)
  res.sendStatus(200)
})

app.get("/cmd", (req, res) => {
  res.send(command)
  command = "none"
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
