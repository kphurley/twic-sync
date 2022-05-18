import React from 'react';

import FormInput from '../shared/FormInput';
import Layout from '../shared/Layout';

const TWIC_TOOLTIP_TEXT = "Lower bound of the article number to sync"

export default function OptionsPanel({ directory, onDirectoryChange, onTwicNumberChange, twicNumber }) {
  return (
    <Layout type="flex-vertical" className="OptionsPanel">
      <FormInput
        handler={onDirectoryChange}
        labelText="Local File Directory"
        name="directory"
        type="text"
        value={directory}
      />
      <FormInput
        handler={onTwicNumberChange}
        labelText="TWIC Number (optional)"
        name="twic-number"
        tooltip={TWIC_TOOLTIP_TEXT}
        type="number"
        value={twicNumber}
      />
    </Layout>
  )
};
