import './App.css';
import Home from './components/Home';
import Image from './components/Image';
import Video from './components/Video';
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
