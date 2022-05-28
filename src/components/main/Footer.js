import React from 'react';

import Button from '../shared/Button';
import cavemanIcon from '../../assets/caveman.png';

function DonateToTwicPanel() {
  return (
    <div className="DonateToTwicPanel">
      <div>Data courtesy of</div>
      <a href="https://www.theweekinchess.com/" target="_blank">
        <div>theweekinchess.com</div>
      </a>
      <a href="https://www.theweekinchess.com/" target="_blank">
        <Button type="secondary-sm" text="Donate to TWIC" />
      </a>
    </div>
  );
}

function ProjectGithubLink() {
  return (
    <div className="ProjectGithubLink">
      <div>
        &copy; Kevin Hurley
      </div>
      <div>
        <a href="https://github.com/kphurley/twic-sync/" target="_blank">
          Github
        </a>
      </div>
      <div>
        <a href="https://www.patreon.com/kphurley" target="_blank">
          Patreon
        </a>
      </div>
    </div>
  );
}

function LinkToCavemanChess() {
  return (
    <div className="LinkToCavemanChess">
      <a href="https://www.cavemanchess.com/" target="_blank">
        <img src={cavemanIcon} alt="cavemanChess" />
      </a>
      <div>Caveman Chess LLC</div>
      <a href="https://www.cavemanchess.com/" target="_blank">
        <div>www.cavemanchess.com</div>
      </a>
    </div>
  );
}

export default function Footer() {
  return (
    <div className="Footer" >
      <DonateToTwicPanel />
      <ProjectGithubLink />
      <LinkToCavemanChess />
    </div>
  )
};
