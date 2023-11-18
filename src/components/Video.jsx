import * as faceapi from 'face-api.js';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Video = () => {
  const navigate = useNavigate();
  const [glass, setGlass] = useState(false);
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
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      // check if a person is wear a glasses
      detections.map((detection, index) => {
        if (
          detection.landmarks &&
          detection.landmarks.getLeftEye &&
          detection.landmarks.getRightEye
        ) {
          const leftEye = detection.landmarks.getLeftEye();
          const rightEye = detection.landmarks.getRightEye();

          // check if the distance between the eyes suggests the person is wearing glasses
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye[0]._x - leftEye[3]._x, 2) +
              Math.pow(rightEye[0]._y - leftEye[3]._y, 2),
          );
          console.log(eyeDistance);

          if (35 < eyeDistance && eyeDistance < 90) {
            setGlass(true);
            console.log(`Person ${index + 1} is wearing glasses`);
          } else {
            console.log('Not wearing glasses or eyes are close together.');
          }
          return;
        }
      });

      // draw face detections
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current,
      );

      const displaySize = {
        width: 640,
        height: 480,
      };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const resized = faceapi.resizeResults(detections, displaySize);

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
    }, 1000);
  };

  return (
    <div className='w-full flex items-center justify-evenly my-20'>
      <div className='w-[120px] flex flex-col justify-center gap-10'>
        <span
          className='bg-[#064889] hover:bg-[#1d4874] hover:cursor-pointer flex items-center justify-center text-2xl h-14 rounded-xl'
          onClick={() => {
            navigate(0, { replace: true });
          }}
        >
          Refresh
        </span>
        <span
          className='bg-[#064889] hover:bg-[#1d4874] hover:cursor-pointer flex items-center justify-center text-2xl h-14 rounded-xl'
          onClick={() => {
            navigate('/');
            navigate(0, { replace: true });
          }}
        >
          Home
        </span>
        {glass && <span>Person is wearing glasses</span>}
      </div>
      <div>
        <video
          crossOrigin='anonymous'
          ref={videoRef}
          autoPlay
          onChange={() => {
            setGlass(false);
          }}
        />
        <canvas
          ref={canvasRef}
          className='absolute top-20'
        />
      </div>
    </div>
  );
};

export default Video;
