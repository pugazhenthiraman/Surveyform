// import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';   // <-- make sure this file exists!

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');
createRoot(container).render(<App />);
