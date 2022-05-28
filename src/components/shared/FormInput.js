import React from 'react';
import ReactTooltip from 'react-tooltip';

import infoIcon from '../../assets/info.png';

const TooltipIcon = () => <img src={infoIcon} alt="info" className="InfoIcon" />

export default function FormInput({
  handler,
  labelText,
  name,
  tooltip,
  type,
  value
}) {
  const tooltipId = `${name}-tooltip`;
  return (
    <div className="form-input-container">
      <label for={name}>
        {labelText}
        {tooltip && <a className="tooltip-anchor" data-tip data-for={tooltipId}><TooltipIcon /></a>}
        {tooltip &&
          <ReactTooltip id={tooltipId}>
            { tooltip.map((text) => <div>{text}</div> )}
          </ReactTooltip>
        }
      </label>
      <input type={type} id={name} name={name} value={value} onChange={handler}></input>
    </div>
  )
};
