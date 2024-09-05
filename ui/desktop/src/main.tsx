import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Next from './routes/operators';
import Register from './routes/generate';
import FilePage from './routes/file';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/join/operators" element={<Next />} />
        <Route path="/join/generate" element={<Register />} />
        <Route path="/files" element={<FilePage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
