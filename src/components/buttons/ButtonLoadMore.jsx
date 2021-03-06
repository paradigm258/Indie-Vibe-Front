import React from 'react';

function ButtonLoadMore(props) {
  return (
    <div
      className='button button-load-more font-short-s link-underline underline'
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export default ButtonLoadMore;
