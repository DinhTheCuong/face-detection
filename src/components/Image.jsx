import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const Image = () => {
  const [img, setImg] = useState(null);
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
      faceapi.nets.faceExpressionNet.loadFromUri('./models'),
      faceapi.loadMtcnnModel('/models'),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

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
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <input
        type='file'
        onChange={(e) => setImg(e.target.files[0])}
      />
      <img
        src={img ? URL.createObjectURL(img) : ''}
        alt='img'
        style={{ marginTop: '20px' }}
        ref={imageRef}
      />
      <canvas
        ref={canvasRef}
        className='canvas-img'
      />
    </div>
  );
};

export default Image;
