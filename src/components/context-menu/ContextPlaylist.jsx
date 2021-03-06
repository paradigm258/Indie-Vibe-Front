import React, { useContext } from 'react';

import { LinkWhiteColor } from '../links';
import { LibraryContext, AuthContext } from '../../contexts';
import {
  deleteTrackList,
  performAction,
  getPlaylistSimple
} from '../../apis/API';

function ContextPlaylist(props) {
  const { content } = props;

  return (
    <div className='context-menu' ref={props.elemRef}>
      {Array.isArray(content.relation) ? (
        content.relation.includes('own') ? (
          <Me {...props} />
        ) : (
          <Other {...props} />
        )
      ) : (
        ''
      )}
    </div>
  );
}

function Me(props) {
  const { content, handlers } = props;

  const { state: authState } = useContext(AuthContext);
  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  const handleDeletePlaylist = id => {
    handlers.handleClose();

    libDispatch(
      libActions.setConfirmDialog(
        true,
        'Confirm deleting this playlist?',
        () => {
          deleteTrackList(authState.token, 'playlist', id)
            .then(res => {
              if (res.status === 'success') {
                libDispatch(
                  libActions.setNotification(true, true, 'Playlist deleted')
                );
                libDispatch(libActions.deletePlaylist(id));
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
      )
    );
  };

  const handleTogglePlaylistPrivate = action => {
    handlers.handleClose();
    performAction(authState.token, content.id, action, 'playlist').then(res => {
      if (res.status === 'success') {
        libDispatch(
          libActions.togglePlaylistPrivate({
            id: content.id,
            status: action === 'make-public' ? 'public' : 'private'
          })
        );
      }
    });
  };

  const handleEditPlaylist = () => {
    handlers.handleClose();
    getPlaylistSimple(authState.token, content.id).then(res => {
      if (res.status === 'success') {
        libDispatch(libActions.setEditPlaylist(true, 'edit', res.data));
      }
    });
  };

  return (
    <ul>
      <li>{props.AddToQueue}</li>
      <li>
        {content.status === 'public' ? (
          <LinkWhiteColor
            onClick={() => {
              handleTogglePlaylistPrivate('make-private');
            }}
          >
            Set private
          </LinkWhiteColor>
        ) : (
          <LinkWhiteColor
            onClick={() => {
              handleTogglePlaylistPrivate('make-public');
            }}
          >
            Set public
          </LinkWhiteColor>
        )}
      </li>
      <li>
        <LinkWhiteColor onClick={handleEditPlaylist}>Edit</LinkWhiteColor>
      </li>
      <li>
        <LinkWhiteColor
          onClick={() => {
            handleDeletePlaylist(content.id);
          }}
        >
          Delete
        </LinkWhiteColor>
      </li>
      <li>{props.ShareFacebook}</li>
    </ul>
  );
}

function Other(props) {
  const { content, handlers } = props;

  return (
    <ul>
      <li>{props.AddToQueue}</li>
      <li>
        {content.relation.includes('favorite') ? (
          <LinkWhiteColor
            onClick={() => {
              handlers.handleToggleFavorite('unfavorite');
            }}
          >
            Remove from library
          </LinkWhiteColor>
        ) : (
          <LinkWhiteColor
            onClick={() => {
              handlers.handleToggleFavorite('favorite');
            }}
          >
            Add to library
          </LinkWhiteColor>
        )}
      </li>
      <li>{props.ShareFacebook}</li>
    </ul>
  );
}

export default ContextPlaylist;
