const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public")); // เพิ่มบรรทัดนี้

let serverStatus = {
    players: 0,
    maxPlayers: 0,
    online: false
};

app.post("/status", (req, res) => {
    serverStatus = req.body;
    console.log("Status Update:", serverStatus);
    res.send({ ok: true });
});

app.get("/status", (req, res) => {
    res.json(serverStatus);
});

app.listen(3000, () => {
    console.log("API running on port 3000");
});