import { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const Video = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  // load from useEffect
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // open webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // load models face api
  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
      faceapi.nets.faceExpressionNet.loadFromUri('./models'),
      faceapi.loadMtcnnModel('/models'),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      // draw face detections
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current,
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
    }, 1000);
  };

  return (
    <div className='video'>
      <div className='frame'>
        <video
          crossOrigin='anonymous'
          ref={videoRef}
          autoPlay
        />
      </div>
      <canvas
        ref={canvasRef}
        className='canvas-vid'
        width='940'
        height='650'
      />
    </div>
  );
};

export default Video;
