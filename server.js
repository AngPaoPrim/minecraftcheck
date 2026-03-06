const express=require("express")
const cors=require("cors")
const {Rcon}=require("rcon-client")

const app=express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const HOST="vowel-invitation.gl.joinmc.link"
const RCON_PORT=25575
const PASSWORD="AngPaoAdmin987"

app.post("/cmd",async(req,res)=>{

let command=req.body.command

try{

const rcon=await Rcon.connect({
host:HOST,
port:RCON_PORT,
password:PASSWORD
})

let result=await rcon.send(command)

res.json({result})

rcon.end()

}catch(e){

res.json({error:e.toString()})

}

})

app.listen(3000,()=>{
console.log("Server running")
})