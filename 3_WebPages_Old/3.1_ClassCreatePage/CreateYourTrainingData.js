function startCam() {
  const video = document.getElementById('videoCanv');
  const canvas = document.getElementById('kameraCanv');
  const context = canvas.getContext('2d'); // Hier den Kontext definieren
  
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
  video.srcObject = stream;
  })
  .catch(function(err) {
    console.error('Fehler beim Zugriff auf die Kamera: ', err);
  });
  
  video.addEventListener('play', function() {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
  function draw() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height); // context verwenden
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
});
}
  
window.addEventListener('load', startCam);
  