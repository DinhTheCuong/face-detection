import * as faceapi from 'face-api.js';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Video = () => {
  const navigate = useNavigate();
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

      // draw face detections
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current,
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: 640,
        height: 480,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 640,
        height: 480,
      });

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
      </div>
      <div>
        <video
          crossOrigin='anonymous'
          ref={videoRef}
          autoPlay
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
