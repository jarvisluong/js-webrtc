// npm install peer
// http://localhost:9000/myapp
const { PeerServer } = require("peer");
const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
  debug: true,
  proxied: true,
});

peerServer.on("connection", (client) => {
  console.log(client);
});
