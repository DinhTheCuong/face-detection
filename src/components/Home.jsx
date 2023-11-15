import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h1>Face Detection</h1>
      <Link to={'/image'}>Input Image</Link>
      <Link to={'/video'}>Input Video</Link>
    </div>
  );
};

export default Home;
