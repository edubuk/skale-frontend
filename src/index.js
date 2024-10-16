import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { EdubukProvider } from './Context/EdubukContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
  <EdubukProvider>
    <App />
    </EdubukProvider>
    </BrowserRouter>
  </React.StrictMode>
);


