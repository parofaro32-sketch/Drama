import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchPage } from '@/pages/SearchPage';
import { VideoPage } from '@/pages/VideoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/watch/:id" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
