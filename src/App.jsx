import './App.css';
import Home from './components/Home';
import Image from './components/Image';
import Video from './components/Video';
import Compare from './components/Compare';
import RegistFace from './components/RegistFace';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/compare'
          element={<Compare />}
        />
        <Route
          path='/regist'
          element={<RegistFace />}
        />
        <Route
          path='/image'
          element={<Image />}
        />
        <Route
          path='/video'
          element={<Video />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
