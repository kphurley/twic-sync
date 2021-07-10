import React, { useEffect, useState } from 'react';

import { MainScreen, SyncScreen } from './components';

import { fetchTwicUrls } from './utilities/scraper';

import './App.css';

const APP_STATES = {
  SYNCHING: "syncing",
  DATA_AVAILABLE: "dataAvailable",
  UP_TO_DATE: "upToDate",
  ERRORED: "errored",
  SELECTING_FILES: "selectingFiles"
}

const MAIN_SCREEN_STATES = [
  APP_STATES.SYNCHING,
  APP_STATES.DATA_AVAILABLE,
  APP_STATES.UP_TO_DATE,
  APP_STATES.ERRORED
]

export default function App() {
  const [ appState, setAppState ] = useState(APP_STATES.SYNCHING);
  const [ availableUrls, setAvailableUrls ] = useState([]);

  useEffect(() => {
    fetchTwicUrls().then((urls) => {
      if (urls.length == 0) {
        setAppState(APP_STATES.UP_TO_DATE);
      } else {
        setAppState(APP_STATES.DATA_AVAILABLE);
        setAvailableUrls(urls);
      }
    });
  }, []);

  const shouldRenderMainScreen = MAIN_SCREEN_STATES.includes(appState);
  const screenProps = { appState, availableUrls };

  return (
    <div className="App">
      {
        shouldRenderMainScreen
        ? <MainScreen { ...screenProps } />
        : <SyncScreen { ...screenProps } />
      }
    </div>
  )
}
