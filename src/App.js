import React, { useEffect, useState } from 'react';

import { MainScreen, SyncScreen } from './components';

import { getTwicUrlStatuses } from './utilities/scraper';
import { checkValidDirectory, registerHandler, performSync } from './utilities/fileHandlers';

import './App.css';

const APP_STATES = {
  SYNCHING: "syncing",
  DATA_AVAILABLE: "dataAvailable",
  UP_TO_DATE: "upToDate",
  INVALID_DIRECTORY: "invalidDirectory",
  ERRORED: "errored",
  DOWNLOADING_FILES: "downloadingFiles",
  SELECTING_FILES: "selectingFiles"
}

const MAIN_SCREEN_STATES = [
  APP_STATES.SYNCHING,
  APP_STATES.DATA_AVAILABLE,
  APP_STATES.UP_TO_DATE,
  APP_STATES.ERRORED,
  APP_STATES.INVALID_DIRECTORY
]

export default function App() {
  const [ appState, setAppState ] = useState(APP_STATES.SYNCHING);
  const [ urlStatuses, setUrlStatuses ] = useState([]);
  const [ directory, setDirectory ] = useState(window.localStorage.getItem('directory'));

  const handleUrlStatuses = (newUrlStatuses) => {
    const hasUnsynchedUrls = newUrlStatuses && !!(newUrlStatuses.find((u) => u.status === "unsynched"));
    const hasErroredUrls = !newUrlStatuses || !!(newUrlStatuses.find((u) => u.status === "errored"));

    if (hasErroredUrls) {
      setAppState(APP_STATES.ERRORED);
    } else if (hasUnsynchedUrls) {
      setAppState(APP_STATES.DATA_AVAILABLE);
    } else {
      setAppState(APP_STATES.UP_TO_DATE);
    }

    setUrlStatuses(newUrlStatuses);
  };

  const getUrlStatusesAndSetAppState = (directory) => {
    const hasValidDirectory = checkValidDirectory(directory);

    if (!hasValidDirectory) {
      setAppState(APP_STATES.INVALID_DIRECTORY);
      return;
    }

    setAppState(APP_STATES.SYNCHING);

    return getTwicUrlStatuses(directory).then(handleUrlStatuses).catch((e) => console.error(e));
  };

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
    registerHandler('sync-urls-reply', handleUrlStatuses);
  },  []);

  useEffect(() => {
    getUrlStatusesAndSetAppState(directory);
  }, [directory]);

  const onDirectoryChange = (e) => {
    const newDir = e.target.value;
    window.localStorage.setItem('directory', newDir);
    setDirectory(newDir);
  }

  const shouldRenderMainScreen = MAIN_SCREEN_STATES.includes(appState);
  const screenProps = { 
    appState,
    urlStatuses,
    directory,
    onDirectoryChange,
    setAppState,
    onBackButtonPress: () => getUrlStatusesAndSetAppState(directory),
    onRefresh: () => getUrlStatusesAndSetAppState(directory),
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
