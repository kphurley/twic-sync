import React from 'react';

//import './layout.css';

/* 
Types
flex-vertical
flex-horizontal
*/

export default function Layout(props) {
  return (
    <div className={`layout ${props.type} ${props.className}`}>
      { props.children.map((child, idx) =>
          <div className={`${props.type}-item ${props.itemClassName} ${props.itemClassName}-${idx}`}>
            { child }
          </div>
        )
      }
    </div>
  )
};
