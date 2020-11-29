var video = document.querySelector("#video");
var canvas = document.querySelector("#overlay");
var context = canvas.getContext("2d");
var constraints = {
  audio: false,
  video: { width: { exact: 320 }, height: { exact: 240 } }
};
var track = new clm.tracker({
  useWebGL: true
});

/*
async function slogging() {
  await console.log("aaa");
}

slogging();
*/
function adjustVideo() {
  // 映像が画面幅いっぱいに表示されるように調整
  var ratio = window.innerWidth / video.videoWidth;

  video.width = window.innerWidth;
  video.height = video.videoHeight * ratio;
  canvas.width = video.width;
  canvas.height = video.height;
}

function startTracking() {
  // トラッキング開始
  track.start(video);

  drawLoop();
}

function drawLoop() {
  // 描画をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);
  // videoをcanvasにトレース
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (track.getCurrentPosition()) {
    // 顔のパーツの現在位置が存在
    console.log("aaa");
    track.draw(canvas);
  }

  requestAnimationFrame(drawLoop);
}

track.init(pModel);

// カメラから映像を取得
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream;
    // 動画のメタ情報のロードが完了したら実行
    video.onloadedmetadata = function () {
      adjustVideo();
      startTracking();
    };
  })
  .catch((err) => {
    window.alert(err.name + ": " + err.message);
  });
