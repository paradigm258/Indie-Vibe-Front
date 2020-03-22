import React, { useState, useRef, useContext } from 'react';

import { AuthContext, LibraryContext } from '../../contexts';
import { createPlaylist } from '../../apis/API';
import { InputFileLabel, InputText } from '../inputs';
import { ButtonMain } from '../buttons';

import { CloseIcon } from '../../assets/svgs';
import PlaylistPlaceholder from '../../assets/imgs/playlist-placeholder.png';

function GroupPlaylistDialog(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const { isUpdated, handleCloseDialog, handleCreatePlaylistSuccess } = props;

  const [info, setInfo] = useState({
    title: props.title,
    description: props.description ? props.description : null
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailSrc, setThumbnailSrc] = useState(props.thumbnail);
  const [submitted, setSubmitted] = useState(0);

  const thumbnailRef = useRef();

  const handleChangeThumbnail = () => {
    let file = thumbnailRef.current.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = e => {
        setThumbnail(file);
        setThumbnailSrc(reader.result);
      };
    }
  };

  const handleChangeInfo = e => {
    setInfo({
      ...info,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleSubmit = () => {
    setSubmitted(1);
    if (!info.title) return;

    setSubmitted(2);
    createPlaylist(authState.token, info.title, info.description, thumbnail)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          handleCreatePlaylistSuccess(res.data);
          handleCloseDialog();
          libDispatch(
            libActions.setNotification(true, true, 'Playlist created')
          );
        } else {
          libDispatch(
            libActions.setNotification(true, false, 'Failed to create playlist')
          );
          setSubmitted(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handlePropagateDialog = e => {
    e.stopPropagation();
  };

  return (
    <div className='playlist-dialog-wrapper' onClick={handleCloseDialog}>
      <div className='playlist-dialog' onClick={handlePropagateDialog}>
        <CloseIcon
          className='close svg--regular svg--cursor svg--scale'
          onClick={handleCloseDialog}
        />
        <div className='playlist-dialog__header font-short-big font-weight-bold font-white'>
          Create Playlist
        </div>
        <div className='playlist-dialog__body'>
          <div className='left'>
            <div className='left__playlist-title-input'>
              <InputText
                type='text'
                name='title'
                value={info.title}
                placeholder='Playlist name'
                onChange={handleChangeInfo}
                error={submitted && !info.title}
                errMessage='Must have a title'
              />
            </div>
            <div className='left__playlist-desc-input'>
              <textarea
                name='description'
                className='input-text input-text--full'
                placeholder='Description for this playlist (optional)'
                onChange={handleChangeInfo}
              >
                {info.description}
              </textarea>
            </div>
          </div>
          <div className='right'>
            <div className='right__cover'>
              <input
                type='file'
                ref={thumbnailRef}
                name='playlistCover'
                id='playlist-cover'
                className='input-custom'
                accept='image/*'
                onChange={handleChangeThumbnail}
              />
              <InputFileLabel
                for='playlist-cover'
                keep={true}
                className='input-label--img'
              >
                <img src={thumbnailSrc ? thumbnailSrc : PlaylistPlaceholder} />
              </InputFileLabel>
            </div>
            <div className='right__button'>
              <ButtonMain
                onClick={handleSubmit}
                disabled={submitted === 2 ? true : false}
              >
                {isUpdated ? 'Save' : 'Create'}
                {submitted === 2 ? '...' : ''}
              </ButtonMain>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPlaylistDialog;
