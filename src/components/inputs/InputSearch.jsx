import React from 'react';

import { SearchIcon } from '../../assets/svgs';

function InputSearch({ placeholder = 'Search', onChange = () => {} }) {
  return (
    <div className='input-search'>
      <SearchIcon />
      <input
        type='text'
        className='font-white font-short-s'
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export default InputSearch;
