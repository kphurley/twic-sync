import React from 'react';

export default function Button(props) {
  return (
    <button className={`button button-${props.type}`} onClick={props.onClick}>{ props.text }</button>
  )
};
