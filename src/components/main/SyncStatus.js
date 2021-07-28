import React from 'react';

import Button from '../shared/Button';
import Layout from '../shared/Layout';

import attentionIcon from '../../assets/attention.png';
import checkMarkIcon from '../../assets/checkmark.png';
import erroredIcon from '../../assets/x-button.png';

import SyncLoader from "react-spinners/SyncLoader";


function DataAvailableIndicator(props) {
  const indicatorMap = {
    syncing: {
      icon: <SyncLoader size={10} />,
      text: "Synching..."
    },
    dataAvailable: {
      icon: <img src={attentionIcon} alt="attention" className="DataAvailableIcon" />,
      text: "Data Available!"
    },
    upToDate: {
      icon: <img src={checkMarkIcon} alt="upToDate" className="UpToDateIcon" />,
      text: "Up to Date!"
    },
    errored: {
      icon: <img src={erroredIcon} alt="errored" className="ErroredIcon" />,
      text: "Errored"
    }
  }

  return (
    <span className="DataAvailable">
      <span className="DataAvailable-icon">
        { indicatorMap[props.appState].icon }
      </span>
      <span className="DataAvailable-text">
        { indicatorMap[props.appState].text }
      </span>
    </span>
  )
};

export default function SyncStatus(props) {
  const appStateIsUpToDateOrErrored = (props.appState === "upToDate" || props.appState === "errored");

  const buttonAction = appStateIsUpToDateOrErrored ? props.onRefresh : props.onSyncInit;
  const buttonText = appStateIsUpToDateOrErrored ? "Refresh" : "Sync!";
  const buttonType = appStateIsUpToDateOrErrored ? "refresh" : "primary";

  return (
    <Layout type="flex-vertical" className="SyncStatus" itemClassName="SyncStatusItem">
      <DataAvailableIndicator {...props} />
      <Button type={buttonType} onClick={buttonAction} text={buttonText} />
    </Layout>
  )
};
