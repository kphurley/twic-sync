import React from 'react';

import Layout from '../shared/Layout';

export default function OptionsPanel(props) {
  // TODO - onChange and directory should be provided
  return (
    <Layout type="flex-vertical" className="OptionsPanel">
      <label for="directory">Local File Directory</label>
      <input type="text" id="directory" name="directory" value={props.directory} onChange={() => {}}></input>
    </Layout>
  )
};
