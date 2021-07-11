import React from 'react';

import Button from '../shared/Button';
import Layout from '../shared/Layout';
import cavemanIcon from '../../assets/caveman.png';

function DonateToTwicPanel(props) {
  return (
    <div className="DonateToTwicPanel">
      <div>Data courtesy of https://theweekinchess.com/</div>
      <a href="https://www.theweekinchess.com/" target="_blank">
        <Button type="secondary-sm" text="Donate to TWIC" />
      </a>
    </div>
  );
}

function LinkToCavemanChess(props) {
  return (
    <div className="LinkToCavemanChess">
      <a href="https://www.cavemanchess.com/" target="_blank">
        <img src={cavemanIcon} alt="cavemanChess" />
      </a>
    </div>
  );
}

export default function Footer(props) {
  return (
    <Layout type='flex-horizontal' className="Footer" itemClassName="footer-items">
      <DonateToTwicPanel />
      <LinkToCavemanChess />
    </Layout>
  )
};
