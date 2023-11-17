import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

const RegistFace = () => {
  const navigate = useNavigate();
  const [img, setImg] = useState(null);
  const [referenceImg, setReferenceImg] = useState(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const imageRef = useRef();
  const canvasRef = useRef();

  // load from useEffect
  useEffect(() => {
    // imageRef && loadModels();
  });

  // set reference image
  // if (referenceImg) {
  //   const results = Promise.all(
  //     faceapi
  //       .detectAllFaces(referenceImg)
  //       .withFaceLandmarks()
  //       .withFaceDescriptors(),
  //   );

  //   if (!results.length) {
  //     return;
  //   }
  //   setFaceMatcher(new faceapi.FaceMatcher(results));
  // }

  // if (img) {
  //   const singleResult = Promise.all(
  //     faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor(),
  //   );

  //   if (singleResult) {
  //     const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
  //     console.log(bestMatch.toString());
  //   }
  // }

  return (
    <div className='h-screen flex items-center justify-evenly py-10'>
      <div className='w-[120px] flex flex-col justify-center gap-10'>
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
      </div>
      <div className='w-[400px] h-full flex flex-col'>
        <img
          src={
            referenceImg
              ? URL.createObjectURL(referenceImg)
              : 'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg'
          }
          className='object-cover mb-20'
          ref={imageRef}
        />
        <canvas
          ref={canvasRef}
          className='absolute top-0'
        />
        <span className='text-xl mb-8'>Input Reference Image</span>
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
          ref={imageRef}
        />
        <canvas
          ref={canvasRef}
          className='absolute top-0'
        />
        <span className='text-xl mb-8'>Input Image To Compare</span>
        <input
          type='file'
          onChange={(e) => setImg(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default RegistFace;
