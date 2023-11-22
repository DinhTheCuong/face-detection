import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadModels, getAllFaces } from '../api/fd';

const initState = {
  imgURL: null,
  allFaces: null,
  detections: null,
  descriptors: null,
  match: null,
  glass: false,
};

const Image2 = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(initState);

  useEffect(() => {
    loadModels();
    handleImg(value.imgURL);
  });

  const handleImg = async (img = value.imgURL) => {
    await getAllFaces(img).then((allFaces) => {
      !!allFaces &&
        setValue({
          allFaces,
          imgURL: img,
          detections: allFaces.map((fd) => fd.detection),
          descriptors: allFaces.map((fd) => fd.descriptor),
        });
    });
  };

  const handleInputFile = (e) => {
    resetState();
    setValue({
      imgURL: URL.createObjectURL(e.target.files[0]),
      loading: true,
    });
    handleImg();
  };

  const resetState = () => {
    setValue(initState);
  };

  let drawBox = null;

  if (value.detections) {
    drawBox = value.detections.map((detection, i) => {
      let _H = detection.box.height;
      let _W = detection.box.width;
      let _X = detection.box._x;
      let _Y = detection.box._y;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            border: 'solid',
            borderColor: 'blue',
            height: _H,
            width: _W,
            transform: `translate(${_X}px,${_Y}px)`,
          }}
        ></div>
      );
    });
  }

  return (
    <div className='flex justify-evenly gap-20 py-10'>
      <div className='flex flex-col justify-center gap-10'>
        <input
          type='file'
          onChange={handleInputFile}
          accept='.jpg, .jpeg, .png'
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
        {value.glass && <span>Person is wearing glasses</span>}
      </div>
      <div className='relative'>
        <img
          src={
            value.imgURL ||
            'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg'
          }
          alt='img'
          // className='h-full object-cover'
        />
        {drawBox ? drawBox : null}
      </div>
    </div>
  );
};

export default Image2;
