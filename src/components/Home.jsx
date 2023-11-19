import face from '../assets/images/face.jpg';
import { useNavigate } from 'react-router-dom';
import {
  MdImageSearch,
  MdVideoCameraBack,
  MdOutlineCompare,
} from 'react-icons/md';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='w-screen h-screen flex items-center'>
      <div className='w-1/2 h-full flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold'>FACE DETECTION</h1>
        <img src={face} />
      </div>
      <div className='w-1/2 h-full flex flex-col items-center justify-center gap-10'>
        <div
          className='bg-[#064889] hover:bg-[#1d4874] hover:cursor-pointer w-[400px] h-[88px] flex items-center justify-start gap-10 pl-16 rounded-xl'
          onClick={() => navigate('/image')}
        >
          <MdImageSearch className='text-6xl' />
          <span className='text-3xl'>INPUT IMAGE</span>
        </div>
        <div
          className='bg-[#064889] hover:bg-[#1d4874] hover:cursor-pointer w-[400px] h-[88px] flex items-center justify-start gap-10 pl-16 rounded-xl'
          onClick={() => navigate('/video')}
        >
          <MdVideoCameraBack className='text-6xl' />
          <span className='text-3xl'>WEBCAM</span>
        </div>
        <div
          className='bg-[#064889] hover:bg-[#1d4874] hover:cursor-pointer w-[400px] h-[88px] flex items-center justify-start gap-10 pl-16 rounded-xl'
          onClick={() => navigate('/regist')}
        >
          <MdOutlineCompare className='text-6xl' />
          <span className='text-3xl'>COMPARE</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
