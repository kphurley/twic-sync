import React from 'react';

import FormInput from '../shared/FormInput';
import Layout from '../shared/Layout';

// The text is arranged one element per line
// which is why it's an array
const DIRECTORY_TOOLTIP_TEXT = [
  "Directory to save your files",
  "Windows example: 'C:/some/path'",
  "Mac example: '/some/path'"
]
const TWIC_TOOLTIP_TEXT = ["Lower bound of the article number to sync"]

export default function OptionsPanel({ directory, onDirectoryChange, onTwicNumberChange, twicNumber }) {
  return (
    <Layout type="flex-vertical" className="OptionsPanel">
      <FormInput
        handler={onDirectoryChange}
        labelText="Local File Directory"
        name="directory"
        tooltip={DIRECTORY_TOOLTIP_TEXT}
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
