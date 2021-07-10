import React from 'react';

import Footer from './main/Footer';
import Header from './main/Header';
import OptionsPanel from './main/OptionsPanel';
import SyncStatus from './main/SyncStatus';

import Layout from './shared/Layout';

export default function MainScreen(props) {
  return (
    <Layout type='flex-vertical'>
      <Header text='The Week in Chess' />
      <Layout type='flex-horizontal'>
        <SyncStatus {...props} />
        <OptionsPanel {...props} />
      </Layout>
      <Footer />
    </Layout>
  )
};
