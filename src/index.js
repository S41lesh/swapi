import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // If you have custom CSS styles
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
