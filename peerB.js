// (B1) HANDSHAKE WITH PEER SERVER
const peer = new Peer("501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-B", {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

var isCalling = false;
var prevFovIdx = 0;

var merger = new VideoStreamMerger({width: 480, height:270})

var mp4Element1 = document.createElement('video');
mp4Element1.src = "video/p1.mp4";
mp4Element1.autoplay = true;
var stream1 = mp4Element1.captureStream();

var mp4Element2 = document.createElement('video');
mp4Element2.src = "video/p2.mp4";
mp4Element2.autoplay = true;
var stream2 = mp4Element2.captureStream();

var mp4Element3 = document.createElement('video');
mp4Element3.src = "video/p3.mp4";
mp4Element3.autoplay = true;
var stream3 = mp4Element3.captureStream();

var mp4Element4 = document.createElement('video');
mp4Element4.src = "video/p4.mp4";
mp4Element4.autoplay = true;
var stream4 = mp4Element4.captureStream();

const streams = [stream1, stream2, stream3, stream4];

function addStreamToMerger(streamIdx, scale=1) {
  var stream = streams[streamIdx];

  const width = 120*scale;
  const height = 270*scale;

  merger.addStream(stream, {
    x: 0,
    y: 0,
    width: 120,
    height: 270,
    mute: false,
    draw: function (ctx, frame, done) {
      ctx.drawImage(frame, 120*streamIdx, 0, width, height)
      stream.getVideoTracks().forEach(track => {
        // const constraints = track.getConstraints()
        // var str = JSON.stringify(constraints);
        // console.log(`#### ${str}`)
      });
      done()
    }
  })  
}

addStreamToMerger(0);
addStreamToMerger(1);
addStreamToMerger(2);
addStreamToMerger(3);

merger.start();

let mainStream = merger.result;

// (B2) READY - CONNECT & SEND MESSAGE TO PEER A
peer.on("open", (id) => {
  console.log("Your ID is " + id);

  var conn = peer.connect("501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-A");
  console.log("Tried to connect to peer a");
  conn.on("open", () => {
    console.log("connected");
    conn.send("Hi from PEER-B!");
  });

  conn.on("data", (data) => {
    if (isCalling) {
      // Scale Back previous Fov Stream to normal
      console.log(`Scaling Stream ${prevFovIdx} Back to Normal`)
      var prevFovStream = streams[prevFovIdx];
      merger.removeStream(prevFovStream);
      addStreamToMerger(prevFovIdx, 1);

      // Scale down Current FoV Stream
      console.log(`Scaling Down FoV Stream ${data}`)
      var fovStream = streams[data];
      merger.removeStream(fovStream);
      addStreamToMerger(data, 0.5);

      prevFovIdx = data;
    }
    document.getElementById("fov").innerHTML = data;
  });

  conn.on("error", (error) => {
    console.log(error);
  });
});

peer.on("error", (e) => console.log(e));

function callPeerA() {
  console.log("calling peer A");
  
  var call = peer.call(
    "501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-A",
    mainStream
  );
  isCalling = true;
}

function callPeerC() {
  console.log("calling peer C");

  mp4Element1.onplay = () => {
    var call = peer.call(
      "501bc9d4-b4c9-419e-b7e4-afe3740df432-PEER-C",
      mainStream
    );
    isCalling = true;
  };
}

window.onload = () => {
  document.getElementById("callPeerA").addEventListener("click", (e) => {
    e.preventDefault();
    callPeerA();
  });

  document.getElementById("callPeerC").addEventListener("click", (e) => {
    e.preventDefault();
    callPeerC();
  });
};

window.peer = peer;
