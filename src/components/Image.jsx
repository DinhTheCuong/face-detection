import * as faceapi from 'face-api.js';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Image = () => {
  const navigate = useNavigate();

  const [img, setImg] = useState(null);
  const [glass, setGlass] = useState(false);

  const imageRef = useRef();
  const canvasRef = useRef();

  // load from useEffect
  useEffect(() => {
    imageRef && loadModels();
  }, []);

  // load models
  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
        
      // check if a person is wear a glasses
      detections.map((detection) => {
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

          if (19 < eyeDistance && eyeDistance < 90) {
            setGlass(true);
          }
          return;
        }
      });

      // draw face detections
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        imageRef.current,
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: imageRef.current.width,
        height: imageRef.current.height,
      });

      const resized = faceapi.resizeResults(detections, {
        width: imageRef.current.width,
        height: imageRef.current.height,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
    }, 1000);
  };

  return (
    <div className='flex justify-evenly gap-20 py-10'>
      <div className='flex flex-col justify-center gap-10'>
        <input
          type='file'
          onChange={(e) => {
            setImg(e.target.files[0]), setGlass(false);
          }}
        />
        <span
          className='bg-[#064889] hover:bg-[#1d4874] hover:cursor-pointer flex items-center justify-center text-2xl h-14 rounded-xl'
          onClick={() => {
            navigate(0, { replace: true });
          }}
        >
          Reset
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
      <div className='max-w-[56%] max-h-[600px]'>
        <img
          src={
            img
              ? URL.createObjectURL(img)
              : 'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg'
          }
          alt='img'
          ref={imageRef}
          className='h-full object-cover'
        />
        <canvas
          ref={canvasRef}
          className='absolute top-0 mt-10'
        />
      </div>
    </div>
  );
};

export default Image;
