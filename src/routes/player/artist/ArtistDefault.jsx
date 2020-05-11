import React, { useContext, useEffect, useState } from 'react';
import { getReleasesByType } from '../../../apis/API';
import { ButtonLoadMore } from '../../../components/buttons';
import { CollectionMain } from '../../../components/collections';
import GroupEmpty from '../../../components/groups/GroupEmpty';
import { AuthContext, LibraryContext } from '../../../contexts';
import { model, useEffectSkip } from '../../../utils/Common';

function ArtistDefault(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: libState } = useContext(LibraryContext);

  const [firstRender, setFirstRender] = useState(0);
  const [albums, setAlbums] = useState({ ...model.paging });
  const [singles, setSingles] = useState({ ...model.paging });
  const [eps, setEps] = useState({ ...model.paging });

  const { id: artistId } = props.match.params;
  const struct = {
    're-album': ['Albums', albums, setAlbums],
    're-single': ['Singles', singles, setSingles],
    're-eps': ['EPs', eps, setEps]
  };
  const isEmpty =
    !albums.items.length && !singles.items.length && !eps.items.length;

  useEffect(() => {
    for (let type in struct) {
      getReleasesByType(authState.token, artistId, type)
        .then(res => {
          if (res.status === 'success' && res.data) {
            setFirstRender(last => last + 1);

            const value = struct[type];
            value[2]({ ...value[1], ...res.data.releases });
          } else {
            throw 'Error';
          }
        })
        .catch(err => {
          setFirstRender(last => last + 1);
          console.error(err);
        });
    }
  }, [artistId]);

  // effect-skip: favorite
  useEffectSkip(() => {
    const { ctxFav } = libState;
    if (ctxFav.type === 'release') {
      let found = false;
      const itemsAlbum = [...albums.items];
      found = itemsAlbum.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });

      if (found) return;
      const itemsSingle = [...singles.items];
      found = itemsSingle.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });

      if (found) return;
      const itemsEp = [...eps.items];
      itemsEp.some(item => {
        if (ctxFav.id === item.id) {
          item.relation = [...ctxFav.relation];
          return true;
        }
      });
    }
  }, [libState.ctxFav]);

  const handleLoadMore = type => {
    const value = struct[type];

    getReleasesByType(
      authState.token,
      artistId,
      type,
      value[1].offset + value[1].limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          const { releases } = res.data;
          value[2]({
            ...value[1],
            items: [...value[1].items, ...releases.items],
            offset: releases.offset,
            limit: releases.limit,
            total: releases.total
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return firstRender < 3 ? (
    <div className='artist-default fadein content-padding'>
      <CollectionMain loading />
    </div>
  ) : (
    <GroupEmpty isEmpty={isEmpty} message='No public releases available'>
      <div className='artist-default fadein content-padding'>
        {Object.keys(struct).map((key, index) => {
          const value = struct[key];
          if (value[1].items.length <= 0) return '';

          return (
            <section key={index}>
              <CollectionMain
                header={value[0]}
                items={value[1].items}
                full={true}
              />
              {value[1].total > value[1].offset + value[1].limit ? (
                <ButtonLoadMore
                  onClick={() => {
                    handleLoadMore(key);
                  }}
                >
                  Load more
                </ButtonLoadMore>
              ) : (
                ''
              )}
            </section>
          );
        })}
      </div>
    </GroupEmpty>
  );
}

export default ArtistDefault;
