require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { Rcon } = require("rcon-client")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const HOST      = process.env.RCON_HOST     || "article-calculation.gl.joinmc.link"
const RCON_PORT = parseInt(process.env.RCON_PORT) || 25765
const PASSWORD  = process.env.RCON_PASSWORD || "AngPaoAdmin987"
const ADMIN_KEY = process.env.ADMIN_KEY     || "change-this-secret"

// ---- Rate limiter (30 requests / นาที ต่อ IP) ----
const attempts = new Map()
function rateLimit(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const window = 60_000
  const max = 30

  if (!attempts.has(ip)) attempts.set(ip, [])
  const hits = attempts.get(ip).filter(t => now - t < window)
  hits.push(now)
  attempts.set(ip, hits)

  if (hits.length > max) {
    return res.status(429).json({ error: "Too many requests. Try again later." })
  }
  next()
}

// ---- Auth middleware ----
function requireAuth(req, res, next) {
  const key = req.headers["x-admin-key"]
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  next()
}

// ---- RCON command endpoint ----
app.post("/cmd", rateLimit, requireAuth, async (req, res) => {
  const command = req.body.command

  if (!command || typeof command !== "string" || command.trim() === "") {
    return res.status(400).json({ error: "Invalid command" })
  }

  // บล็อกคำสั่งอันตราย
  const blocked = ["stop", "restart", "op ", "deop", "ban-ip"]
  const isBlocked = blocked.some(b => command.toLowerCase().startsWith(b))
  if (isBlocked) {
    return res.status(403).json({ error: "Command not allowed" })
  }

  let rcon
  try {
    rcon = await Rcon.connect({
      host: HOST,
      port: RCON_PORT,
      password: PASSWORD,
      timeout: 5000
    })

    const result = await rcon.send(command.trim())
    res.json({ result })

  } catch (e) {
    console.error("RCON error:", e.message)
    res.status(500).json({ error: "RCON connection failed: " + e.message })

  } finally {
    if (rcon) rcon.end()
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`RCON target: ${HOST}:${RCON_PORT}`)
})