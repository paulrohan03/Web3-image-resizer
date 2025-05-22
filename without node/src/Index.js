import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';               // remove this line if you don’t want global CSS
import App from './App';            // make sure App.js exists in src/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
