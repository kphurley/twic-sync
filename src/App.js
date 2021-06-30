import React from 'react';

import { fetchRawTwicHtml } from './utilities/scraper';

export default function App() {
  fetchRawTwicHtml();

  return (
    <div>Hello from App</div>
  )
}
