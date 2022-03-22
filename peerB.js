// (B1) HANDSHAKE WITH PEER SERVER
const peer = new Peer("501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-B", {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

// (B2) READY - CONNECT & SEND MESSAGE TO PEER A
peer.on("open", (id) => {
  console.log("Your ID is " + id);

  var conn = peer.connect("501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-A");
  console.log("Tried to connect to peer a");
  conn.on("open", () => {
    console.log("connected");
    conn.send("Hi from PEER-B!");
  });

  conn.on("error", (error) => {
    console.log(error);
  });
});

peer.on("error", (e) => console.log(e));

function callPeerA() {
  var mp4Element1 = document.createElement("video");
  mp4Element1.muted = true;
  mp4Element1.src = "video/p1.mp4";
  mp4Element1.autoplay = true;

  var stream1 = mp4Element1.captureStream();
  var call = peer.call("501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-A", stream1);
}

document.on("ready", () => {
  document.getElementById("callPeerA").addEventListener("click", (e) => {
    e.preventDefault();
    callPeerA();
  });
});

window.peer = peer;
