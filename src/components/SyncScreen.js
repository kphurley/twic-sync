import React, { useEffect, useState } from 'react';

import Layout from './shared/Layout';
import Button from './shared/Button';

import SyncLoader from "react-spinners/SyncLoader";

import { extractTwicNumberFromUrl } from '../utilities/twicNumbers';

function SyncScreenFooter(props) {
  const isDownloadingFiles = props.appState === "downloadingFiles";

  const goBack = () => {
    if (isDownloadingFiles) return;
  
    props.onBackButtonPress();
  };

  const syncSelectedFiles = () => {
    if (isDownloadingFiles) return;

    props.setAppState("downloadingFiles");

    const selectedUrls = Object.keys(props.selectedUrls).filter((url) => props.selectedUrls[url]);
    props.onSync(selectedUrls);
  };

  return (
    <Layout type='flex-horizontal' className="Footer" itemClassName="footer-items">
      <Button type="secondary" onClick={goBack} text="Back" />
      <Button type={ isDownloadingFiles ? "disabled" : "primary"} onClick={syncSelectedFiles} text={ isDownloadingFiles ? <SyncLoader size={10} /> : "Sync!"} />
    </Layout>
  )
};

function getFileNameFromUrl(url) {
  const urlParts = url.split('/');

  // TODO - Probably don't want the "zip" in here...
  return urlParts[urlParts.length - 1];
}

export default function SyncScreen(props) {
  const unsynchedUrlsGreaterThanTwicNumber = props.urlStatuses
    .filter((urlStatus) => 
      extractTwicNumberFromUrl(urlStatus.url) > parseInt(props.twicNumber) &&
      urlStatus.status === "unsynched"
    )
    .map((status) => status.url);
  const initialState = {}
  unsynchedUrlsGreaterThanTwicNumber.forEach((url) => initialState[url] = true);

  // Format is: { [url]: true | false }
  const [ selectedUrls, setSelectedUrls ] = useState(initialState);

  const toggleSelection = (url) => {
    // Don't allow toggling while downloading...
    if (props.appState === "downloadingFiles") return;

    const currentSetting = selectedUrls[url];
    setSelectedUrls({...selectedUrls, [url]: !currentSetting });
  };

  useEffect(() => {
    if (props.appState === "downloadingFiles") {
      // This is blocking..so...hopefully ok???
      
    }
  }, [props.appState, props.selectedUrls])

  return (
    <Layout type='flex-vertical' className='SyncScreen'>
      <div className='SyncScreen-top-text'>Confirm or deselect files to be downloaded</div>
      <div className='SyncScreen-files-area'>
        <div className='SyncScreen-filename-space'>
          <div className='SyncScreen-filename-container'>
            { Object.keys(selectedUrls).map((url) =>
              <div onClick={() => toggleSelection(url)} className={`filename-item ${selectedUrls[url] ? 'selected' : 'unselected'}`}>
                {getFileNameFromUrl(url)}
              </div>
            )}
          </div>
        </div>
      </div>
      <SyncScreenFooter selectedUrls={selectedUrls} {...props} />
    </Layout>
  )
};

