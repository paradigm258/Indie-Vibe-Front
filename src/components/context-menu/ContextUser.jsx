import React, { useContext } from 'react';

import { LinkWhiteColor } from '../links';
import { AuthContext, LibraryContext } from '../../contexts';

function ContextUser(props) {
  const { content } = props;

  const { state: authState } = useContext(AuthContext);

  if (content.id === authState.id) {
    return <Me content={content} />;
  } else {
    return <Other content={content} />;
  }
}

function Me(props) {
  const { content } = props;

  return (
    <div className='context-menu'>
      <ul>
        <li>
          <LinkWhiteColor>Library</LinkWhiteColor>
        </li>
      </ul>
    </div>
  );
}

function Other(props) {
  const { content } = props;

  const { actions: libActions, dispatch: libDispatch } = useContext(
    LibraryContext
  );

  return (
    <div className='context-menu'>
      <ul>
        <li>
          {content.relation.includes('favorite') ? (
            <LinkWhiteColor
              onClick={() => {
                {
                  libDispatch(libActions.toggleCtxFavorite('unfavorite'));
                }
              }}
            >
              Unfollow
            </LinkWhiteColor>
          ) : (
            <LinkWhiteColor
              onClick={() => {
                {
                  libDispatch(libActions.toggleCtxFavorite('favorite'));
                }
              }}
            >
              Follow
            </LinkWhiteColor>
          )}
        </li>
        {content.type === 'artist' ? (
          <li>
            <LinkWhiteColor>Report Artist</LinkWhiteColor>
          </li>
        ) : (
          ''
        )}
      </ul>
    </div>
  );
}

export default ContextUser;
