import React, { useEffect, useState } from 'react';

import { MainScreen, SyncScreen } from './components';

import { getTwicUrlStatuses } from './utilities/scraper';
import { performSync } from './utilities/fileHandlers';

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
  const [ urlStatuses, setUrlStatuses ] = useState([]);
  const [ directory, setDirectory ] = useState(window.localStorage.getItem('directory'));

  const handleUrlStatuses = (newUrlStatuses) => {
    const hasUnsynchedUrls = !!(newUrlStatuses.find((u) => u.status === "unsynched"));
    const hasErroredUrls = !!(newUrlStatuses.find((u) => u.status === "errored"));

    if (hasErroredUrls) {
      setAppState(APP_STATES.ERRORED);
    } else if (hasUnsynchedUrls) {
      setAppState(APP_STATES.DATA_AVAILABLE);
    } else {
      setAppState(APP_STATES.UP_TO_DATE);
    }

    setUrlStatuses(newUrlStatuses);
  };

  // This should run on load
  const getUrlStatusesAndSetAppState = () => {{
    setAppState(APP_STATES.SYNCHING);

    return getTwicUrlStatuses(directory).then(handleUrlStatuses).catch((e) => console.error(e));
  }};

  // This should run only when a "sync" button is pressed and we have data available
  const downloadMissingFiles = () => {{
    // This actually doesn't trigger a re-render, so this state isn't set
    // TODO - this action should just set the selecting files state, and that screen then does the download
    setAppState(APP_STATES.SYNCHING);

    const unsynchedUrls = urlStatuses.filter((u) => u.status === "unsynched").map((status) => status.url);

    return performSync(unsynchedUrls, directory).then(handleUrlStatuses).catch((e) => console.error(e));
  }};

  useEffect(() => {
    // This works to register events that we need to respond with app state changes
    // Maybe this isn't needed?
    window.electron.registerHandler('ping', (arg) => console.log('sent from main', arg));

    getUrlStatusesAndSetAppState();
  }, []);

  const onDirectoryChange = (e) => {
    console.log(e.target.value);
    const newDir = e.target.value;
    window.localStorage.setItem('directory', newDir);
    setDirectory(newDir);
    getUrlStatusesAndSetAppState();
  }

  const shouldRenderMainScreen = MAIN_SCREEN_STATES.includes(appState);
  const screenProps = { 
    appState,
    urlStatuses,
    directory,
    onDirectoryChange,
    onRefresh: getUrlStatusesAndSetAppState,
    onSyncInit: downloadMissingFiles
  };

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
