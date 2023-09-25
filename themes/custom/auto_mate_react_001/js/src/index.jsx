import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const domNode = document.getElementById('react-app');
const root = createRoot(domNode);


root.render(<App />);

// setTimeout(function(){
//   root.unmount();
// }, 3000);