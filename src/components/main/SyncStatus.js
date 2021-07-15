import React from 'react';

import Button from '../shared/Button';
import Layout from '../shared/Layout';

import attentionIcon from '../../assets/attention.png';

// Need a "synching" status with a spinner
function DataAvailableIndicator(props) {
  const dataAvailableIcon = <img src={attentionIcon} alt="attention" className="DataAvailableIcon" />;
  const dataAvailableText = "Data Available!";

  return (
    <span className="DataAvailable">
      { dataAvailableIcon }
      { dataAvailableText }
    </span>
  )
};

export default function SyncStatus(props) {
  // TODO - OnClick and Sync should change based on props.appState
  return (
    <Layout type="flex-vertical" className="SyncStatus" itemClassName="SyncStatusItem">
      <DataAvailableIndicator {...props} />
      <Button type="primary" onClick={props.onSyncInit} text="Sync!" />
    </Layout>
  )
};
