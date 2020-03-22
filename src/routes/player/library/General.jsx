import React, { useState, useEffect, useContext } from 'react';

import { capitalize, useEffectSkip } from '../../../utils/Common';
import { NavLinkColor } from '../../../components/links';
import { CollectionMain } from '../../../components/collections';
import { AuthContext, LibraryContext } from '../../../contexts';
import { library } from '../../../apis/API';

import { ArrowRight } from '../../../assets/svgs';

function General(props) {
  const { id: userId } = props.match.params;

  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(true);
  const [data, setData] = useState({
    playlists: [],
    artists: []
  });

  useEffect(() => {
    library(authState.token, props.match.params.id)
      .then(res => {
        setFirstRender(false);
        if (res.status === 'success' && res.data) {
          setData({ ...data, ...res.data });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffectSkip(() => {
    const { ctxFav } = libState;
    let target = [...data[`${ctxFav.type}s`]];
    target.some(item => {
      if (ctxFav.id === item.id) {
        item.relation = [...ctxFav.relation];
        return true;
      }
    });
    setData({ ...data, [`${ctxFav.type}s`]: target });
  }, [libState.ctxFav]);

  useEffectSkip(() => {
    let target = [...data.playlists];
    setData({
      ...data,
      playlists: target.filter(item => item.id !== libState.ctxDelPlaylistId)
    });
  }, [libState.ctxDelPlaylistId]);

  // playlist privacy
  useEffectSkip(() => {
    const { ctxPlaylistPrivate } = libState;
    let playlists = [...data.playlists];
    playlists.some(playlist => {
      if (ctxPlaylistPrivate.id === playlist.id) {
        playlist.status = ctxPlaylistPrivate.status;
        return true;
      }
    });
    setData({ ...data, playlists });
  }, [libState.ctxPlaylistPrivate]);

  let exist = Object.keys(data).find(key => data[key].length > 0);
  let render = '';
  if (exist) {
    render = Object.keys(data).map((key, index) => {
      if (data[key].length > 0) {
        let type = key.substr(0, key.length - 1);

        return (
          <CollectionMain
            header={
              <NavLinkColor
                href={`/player/library/${userId}/${key}`}
                className='header-title font-white'
              >
                {capitalize(key)}
                <ArrowRight />
              </NavLinkColor>
            }
            items={data[key]}
            type={type}
            key={index}
          />
        );
      }
    });
  } else {
    render = firstRender ? (
      ''
    ) : (
      <span className='font-short-extra font-white font-weight-bold'>
        Library empty
      </span>
    );
  }

  return <div className='fadein'>{render}</div>;
}

export default General;
