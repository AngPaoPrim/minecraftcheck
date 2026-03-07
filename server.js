const express = require("express")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.json())
let status = {
online:false,
players:0,
maxPlayers:20,
playerList:[]
}
let command = "none"
let lastUpdate = Date.now()  // ← แก้จาก 0
app.post("/status",(req,res)=>{
status = req.body
lastUpdate = Date.now()
console.log("Status Update:",status)
res.sendStatus(200)
})
app.get("/status",(req,res)=>{
const alive = (Date.now() - lastUpdate) < 15000
res.json({ ...status, online: status.online && alive })
})
app.get("/players",(req,res)=>{
res.json(status.playerList || [])
})
app.post("/cmd",(req,res)=>{
command = req.body.cmd
console.log("Command from web:",command)
res.sendStatus(200)
})
app.get("/cmd",(req,res)=>{
res.send(command)
command = "none"
})
app.get("/",(req,res)=>{
res.sendFile(__dirname + "/index.html")
})
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
