// This the entry point for the webpack bundle
// It is outputted as dist/bundle.js

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
 
const title = 'React with Webpack and Babel';
 
ReactDOM.render(
  <App />,
  document.getElementById('react-root')
);
