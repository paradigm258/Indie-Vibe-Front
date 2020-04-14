import React from 'react';
import './css/style.scss';

function Authentication(props) {
  return (
    <div className='page-authen'>
      <div className='page-authen__banner'>
        <div className='logo'>
          <a href='/home'>{props.logo}</a>
        </div>
      </div>
      <div className='page-authen__body'>
        <div className='page-authen__body__layer'>
          <form onSubmit={props.handleSubmit} className='form-authen'>
            <div className='form-authen__input'>{props.inputs}</div>
            <div className='form-authen__submit'>{props.submits}</div>
          </form>
          <div className='box-addition'>{props.addition}</div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
