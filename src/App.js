import React, { useEffect, useState } from 'react';

import { MainScreen, SyncScreen } from './components';

import { getTwicUrlStatuses } from './utilities/scraper';
import { registerHandler, performSync } from './utilities/fileHandlers';

import './App.css';

const APP_STATES = {
  SYNCHING: "syncing",
  DATA_AVAILABLE: "dataAvailable",
  UP_TO_DATE: "upToDate",
  ERRORED: "errored",
  DOWNLOADING_FILES: "downloadingFiles",
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

  const goToFileSelectionScreen = () => {{
    setAppState(APP_STATES.SELECTING_FILES);
  }};

  const downloadSelectedFiles = (selectedUrls) => {
    const unsynchedUrls = urlStatuses
      .filter((u) => u.status === "unsynched" && selectedUrls.includes(u.url))
      .map((status) => status.url);

    performSync(unsynchedUrls, directory);
  };

  useEffect(() => {
    getUrlStatusesAndSetAppState();

    registerHandler('sync-urls-reply', handleUrlStatuses);
  }, []);

  const onDirectoryChange = (e) => {
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
    setAppState,
    onBackButtonPress: getUrlStatusesAndSetAppState,
    onRefresh: getUrlStatusesAndSetAppState,
    onSyncInit: goToFileSelectionScreen,
    onSync: downloadSelectedFiles
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
