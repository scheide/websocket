require("dotenv").config();
const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: process.env.PORT,
});

function broadcast(jsonObject) {
  if (!this.clients) return;
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(jsonObject));
    }
  });
}

function onMessage(ws, data) {
  console.log(data.toString());
  ws.send("received!");
}

function onError(ws, err) {
  console.log("onError");
}

function onConnection(ws, req) {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (err) => onError(ws, err));
  console.log("onConnection");
}

wss.on("connection", onConnection);
wss.broadcast = broadcast;

setInterval(() => {
  wss.broadcast({ time: new Date() });
}, 5000);

console.log(`Websocket server is running at ${process.env.PORT}`);
