// (B1) HANDSHAKE WITH PEER SERVER
const peer = new Peer("501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-A", {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

// (B2) READY
peer.on("open", (id) => {
  console.log("Your ID is " + id);
});

// (B3) ON RECEIVING MESSAGE FROM OTHER PEERS
peer.on("connection", (conn) => {
  setInterval(() => {
    conn.send(Math.floor(Math.random() * 4));
  }, 1000);
  conn.on("data", (data) => {
    console.log(data);
  });
  // conn.close();
});

peer.on("error", (e) => console.log(e));

peer.on("call", function (call) {
  // Answer the call, providing our mediaStream
  console.log("Called");
  call.answer();
  call.on("stream", function (stream) {
    // `stream` is the MediaStream of the remote peer.
    // Here you'd add it to an HTML video/canvas element.
    console.log("streaming");
    var mp4Element1 = document.createElement("video");
    mp4Element1.muted = true;
    mp4Element1.autoplay = true;

    mp4Element1.src = window.URL.createObjectURL(stream);

    document.appendChild(mp4Element1);
  });
});

window.peer = peer;
