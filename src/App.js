import React, { useEffect } from "react";
import "./App.css";
import * as canvas from "canvas";
// import * as tf from "@tensorflow/tfjs";
import * as faceapi from "face-api.js";

function App() {

  

  function startVideo(video) {
    console.log("loaded")
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.log(err)
    )
      startDetection(video)
  }

  function startDetection(video){
    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video)
      document.body.append(canvas)
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      // console.log(faceapi.nets)
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        if(resizedDetections.length > 0){
          // ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"]
          if(resizedDetections[0].expressions.happy > 0.5){
            console.log("행복해^^:",resizedDetections[0].expressions.happy);
          }
          if(resizedDetections[0].expressions.sad > 0.5){
            console.log("슬퍼ㅠ.ㅠ:",resizedDetections[0].expressions.sad);
          }
          if(resizedDetections[0].expressions.angry > 0.5){
            console.log("화나!:",resizedDetections[0].expressions.angry);
          }
          if(resizedDetections[0].expressions.fearful > 0.5){
            console.log("무서워ㅠ.ㅠ:",resizedDetections[0].expressions.fearful);
          }
          if(resizedDetections[0].expressions.disgusted > 0.5){
            console.log("역겨워!!:",resizedDetections[0].expressions.disgusted);
          }
          if(resizedDetections[0].expressions.surprised > 0.5){
            console.log("놀라워@.@:",resizedDetections[0].expressions.surprised);
          }
        }

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 100)
    })
  }

  useEffect(() => {
    var video = document.getElementById("video")
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startVideo(video))
  }, []);

  return (
    <video id="video" width="1000" height="800" autoplay="true"></video>
  )
}

export default App;
