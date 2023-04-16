function camInit(stream) {
    var cameraView = document.getElementById("cameraview");
    cameraView.srcObject = stream;
    cameraView.play();

    document.getElementById("btn_div").style.display = "none";
    document.getElementById("video_div").style.display = "block";
    document.getElementById("first_div").style.display = "none";
    document.getElementById("second_div").style.display = "block";

    setTimeout(() => captureImage(), 1000);
}
function camInitFailed(error) {
    console.log("get camera permission failed : ", error)
}
function mainInit() {
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia )
    {
        alert("Media Device not supported")
        return;
    }
    navigator.mediaDevices.getUserMedia({video:true})
        .then(camInit)
        .catch(camInitFailed);
}

function captureImage(){
  var canvas = document.getElementById("canvas");
  var video = document.querySelector("video");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas
    .getContext("2d")
    .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

  const playImage = new Image();
  playImage.src = " ";
  playImage.onload = () => {
    const startX = video.videoWidth / 2 - playImage.width / 2;
    const startY = video.videoHeight / 2 - playImage.height / 2;
    canvas
      .getContext("2d")
      .drawImage(playImage, startX, startY, playImage.width, playImage.height);
    canvas.toBlob() = (blob) => {
      const img = new Image();
      img.src = window.URL.createObjectUrl(blob);
    };
  };
  uploadCanvasData();
}

function uploadCanvasData()
{
    console.log("Uploaded")
    var canvas = $('#canvas').get(0);
    var dataUrl = canvas.toDataURL("image/jpeg");
    var blob = dataURItoBlob(dataUrl);
    var formData = new FormData();
    formData.append("file", blob);

    var request = new XMLHttpRequest();
    request.onload = () => {
        if (request.status == 200) {
            applyCanvas(request.response);
        } else{
            console.log("Convert Error")
        }
    };

    request.open("POST", "imgUpload");
    request.send(formData);
}

function dataURItoBlob(dataURI)
{
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });
    return bb;
}

function addLogs(logObject){
    log = JSON.stringify(logObject);
    logArea = document.getElementById('logs');
    nowText = logArea.value;
    nowText += log + "\n";
    logArea.value = nowText;
}

function applyCanvas(modelOutput){
    modelOutput = JSON.parse(modelOutput);
//    document.getElementById("output_canvas").src = modelOutput.img_name;
    document.getElementById("second_div").style.backgroundImage = "url('"+modelOutput.img_name+"')";
    addLogs(modelOutput.log_info);
    captureImage()
}