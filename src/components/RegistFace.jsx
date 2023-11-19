import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import LoadingSpin from 'react-loading-spin';

const RegistFace = () => {
  const navigate = useNavigate();

  const [img, setImg] = useState(null);
  const [referenceImg, setReferenceImg] = useState(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [probability, setProbability] = useState({
    distance: 0,
    label: null,
  });

  const imgRef1 = useRef();
  const imgRef2 = useRef();
  const canvasRef = useRef();

  // load from useEffect
  useEffect(() => {
    imgRef1 && imgRef2 && loadModels();
  });

  // load models
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
    // set reference image
    if (referenceImg) {
      setInterval(async () => {
        const results = await faceapi
          .detectAllFaces(
            imgRef1.current,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (!results.length) {
          return;
        }

        setFaceMatcher(new faceapi.FaceMatcher(results));
      });
    }

    // set compare img
    if (img) {
      setLoading(true);
      setInterval(async () => {
        const singleResult = await faceapi
          .detectSingleFace(
            imgRef2.current,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (singleResult) {
          const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
          setLoading(false);
          if (bestMatch) {
            setProbability({
              distance: bestMatch.distance,
              label:
                bestMatch._label === 'person 1'
                  ? 'Same Person!'
                  : bestMatch._label,
            });
          }
        }
      });
    }
  };

  return (
    <div className='flex items-center justify-evenly py-10'>
      <div className='w-[200px] flex flex-col justify-center gap-10'>
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
        <div className='flex flex-col gap-6 mt-10'>
          {loading && (
            <LoadingSpin
              size={40}
              primaryColor='#05d7fa'
              secondaryColor='#064889'
              animationDirection='alternate-reverse'
            />
          )}

          <span className='text-xl'>
            Different Probabilities: <br />
            <span className='text-white'>
              {Math.floor(probability.distance * 100)}%
            </span>
          </span>
          <span className='text-xl'>
            Description: <br />
            <span className='text-white'>{probability.label}</span>
          </span>
        </div>
      </div>
      <div className='w-[400px] h-full flex flex-col'>
        <img
          src={
            referenceImg
              ? URL.createObjectURL(referenceImg)
              : 'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg'
          }
          className='object-cover mb-20'
          ref={imgRef1}
        />
        <canvas
          ref={canvasRef}
          className='absolute top-0'
        />
        <span className='text-xl mb-8 text-white'>Input Reference Image</span>
        <input
          type='file'
          onChange={(e) => setReferenceImg(e.target.files[0])}
        />
      </div>
      <div className='w-[400px] h-full flex flex-col'>
        <img
          src={
            img
              ? URL.createObjectURL(img)
              : 'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg'
          }
          className='object-cover mb-20'
          ref={imgRef2}
        />
        <canvas
          ref={canvasRef}
          className='absolute top-0'
        />
        <span className='text-xl mb-8 text-white'>Input Image To Compare</span>
        <input
          type='file'
          onChange={(e) => setImg(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default RegistFace;
