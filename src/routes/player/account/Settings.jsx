import React, { useContext, useState } from 'react';
import { AuthContext, StreamContext } from '../../../contexts';

function Settings(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamActions,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const { settings } = streamState;
  let isFree = authState.role === 'r-free';

  const handleChangeSettings = e => {
    streamDispatch(
      streamActions.setSettings({
        [e.target.getAttribute('name')]: e.target.value
      })
    );
  };

  return (
    <div className='account-settings body__bound fadein'>
      <div className='catalog'>
        <div className='catalog__header'>
          <span className='font-short-extra font-weight-bold font-white'>
            Settings
          </span>
        </div>
        <div className='catalog__body'>
          <div className='form-settings table-layout'>
            <div className='table-row'>
              <span className='label'>Audio quality</span>
              <select
                name='bitrate'
                className='custom-select release-type'
                onChange={handleChangeSettings}
                value={settings.bitrate}
              >
                <option value='128'>Normal</option>
                <option value='320' disabled={isFree}>
                  High
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
