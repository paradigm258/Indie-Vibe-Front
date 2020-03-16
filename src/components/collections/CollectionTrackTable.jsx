import React, { useState, useContext, useEffect } from 'react';

import { NavLinkUnderline } from '../links';
import { getFormattedTime } from '../../utils/Common';
import { AuthContext, StreamContext } from '../../contexts';
import { performActionFavorite } from '../../apis/API';
import { ButtonIcon } from '../buttons';
import { streamCollection } from '../../apis/StreamAPI';

import {
  UnFavoriteIcon,
  TimerIcon,
  DateIcon,
  FavoriteIcon,
  PlayIcon,
  PauseIcon
} from '../../assets/svgs';

function CollectionTrackTable(props) {
  const { type } = props;
  let { items, offset, limit } = props.data;

  return (
    <div className='collection-table'>
      {/* Track table header */}
      <div className='collection-table__row collection-table__row--header'>
        <div className='collection-table__cell collection-table__cell--action'>
          <span>#</span>
        </div>
        <div className='collection-table__cell collection-table__cell--favorite'></div>
        <div className='collection-table__cell collection-table__cell--title'>
          <span>TITLE</span>
        </div>
        {type === 'search' || type === 'playlist' ? (
          <React.Fragment>
            <div className='collection-table__cell collection-table__cell--artist'>
              <span>ARTISTS</span>
            </div>
            <div className='collection-table__cell collection-table__cell--release'>
              <span>RELEASE</span>
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
        <div className='collection-table__cell collection-table__cell--duration'>
          <span>
            <TimerIcon />
          </span>
        </div>
        {type === 'playlist' ? (
          <div className='collection-table__cell collection-table__cell--added-date'>
            <span>
              <DateIcon />
            </span>
          </div>
        ) : (
          ''
        )}
      </div>

      {/* Track table content */}
      {items.slice(offset, limit).map((item, index) => {
        if (type === 'playlist') {
          item = Object.assign(
            {},
            {
              addedAt: item.addedAt,
              ...item.track
            }
          );
          return (
            <RowPlaylist
              item={item}
              key={index}
              serial={index + 1}
              collectionId={props.collectionId}
              handleToggleFavorite={props.handleToggleFavorite}
            />
          );
        } else if (type === 'release') {
          return (
            <RowRelease
              item={item}
              key={index}
              serial={index + 1}
              collectionId={props.collectionId}
              handleToggleFavorite={props.handleToggleFavorite}
            />
          );
        } else {
          return (
            <RowSearch
              item={item}
              key={index}
              serial={index + 1}
              collectionId={item.release ? item.release.id : ''}
              type={props.type}
              handleToggleFavorite={props.handleToggleFavorite}
            />
          );
        }
      })}
    </div>
  );
}

function RowPlaylist(props) {
  const { item, serial } = props;

  return (
    <div className='collection-table__row collection-table__row--data'>
      <CellAction
        serial={serial}
        id={item.id}
        collectionId={props.collectionId}
        type='playlist'
      />
      <CellFavorite
        id={item.id}
        relation={item.relation}
        handleToggleFavorite={props.handleToggleFavorite}
      />
      <div className='collection-table__cell collection-table__cell--title'>
        <span>{item.title}</span>
      </div>
      <div className='collection-table__cell collection-table__cell--artist'>
        <span>
          {item.artists
            ? item.artists
                .map(artist => (
                  <NavLinkUnderline
                    href={`/player/artist/${artist.id}`}
                    className='font-white'
                    key={artist.id}
                  >
                    {artist.displayName}
                  </NavLinkUnderline>
                ))
                .reduce((prev, curr) => [prev, ', ', curr])
            : ''}
        </span>
      </div>
      <div className='collection-table__cell collection-table__cell--release'>
        <span>
          <NavLinkUnderline
            href={`/player/release/${item.release ? item.release.id : ''}`}
            className='font-white'
          >
            {item.release ? item.release.title : ''}
          </NavLinkUnderline>
        </span>
      </div>
      <div className='collection-table__cell collection-table__cell--added-date'>
        <span>{item.addedAt}</span>
      </div>
      <div className='collection-table__cell collection-table__cell--duration'>
        <span>{getFormattedTime(item.duration / 1000)}</span>
      </div>
    </div>
  );
}

function RowRelease(props) {
  const { item, serial } = props;

  return (
    <div className='collection-table__row collection-table__row--data'>
      <CellAction
        serial={serial}
        id={item.id}
        collectionId={props.collectionId}
        type='release'
      />
      <CellFavorite
        id={item.id}
        relation={item.relation}
        handleToggleFavorite={props.handleToggleFavorite}
      />
      <div className='collection-table__cell collection-table__cell--title'>
        <span>{item.title}</span>
      </div>
      <div className='collection-table__cell collection-table__cell--duration'>
        <span>{getFormattedTime(item.duration / 1000)}</span>
      </div>
    </div>
  );
}

function RowSearch(props) {
  const { item, serial } = props;

  const type = props.type === 'favorite' ? props.type : 'release';

  return (
    <div className='collection-table__row collection-table__row--data'>
      <CellAction
        serial={serial}
        id={item.id}
        collectionId={props.collectionId}
        type={type}
      />
      <CellFavorite
        id={item.id}
        relation={item.relation}
        handleToggleFavorite={props.handleToggleFavorite}
      />
      <div className='collection-table__cell collection-table__cell--title'>
        <span>{item.title}</span>
      </div>
      <div className='collection-table__cell collection-table__cell--artist'>
        <span>
          {item.artists
            ? item.artists
                .map(artist => (
                  <NavLinkUnderline
                    href={`/player/artist/${artist.id}`}
                    className='font-white'
                    key={artist.id}
                  >
                    {artist.displayName}
                  </NavLinkUnderline>
                ))
                .reduce((prev, curr) => [prev, ', ', curr])
            : ''}
        </span>
      </div>
      <div className='collection-table__cell collection-table__cell--release'>
        <span>
          <NavLinkUnderline
            href={`/player/release/${item.release ? item.release.id : ''}`}
            className='font-white'
          >
            {item.release ? item.release.title : ''}
          </NavLinkUnderline>
        </span>
      </div>
      <div className='collection-table__cell collection-table__cell--duration'>
        <span>{getFormattedTime(item.duration / 1000)}</span>
      </div>
    </div>
  );
}

function CellFavorite(props) {
  const { state: authState } = useContext(AuthContext);

  const [relation, setRelation] = useState([...props.relation]);

  useEffect(() => {
    props.handleToggleFavorite('track', props.index, relation);
  }, [relation]);

  const handleToggleFavorite = action => {
    performActionFavorite(authState.token, 'track', props.id, relation, action)
      .then(r => {
        setRelation(r);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='collection-table__cell collection-table__cell--favorite'>
      {relation.includes('favorite') ? (
        <FavoriteIcon
          className='svg--cursor svg--scale svg--blue'
          onClick={() => {
            handleToggleFavorite('unfavorite');
          }}
        />
      ) : (
        <UnFavoriteIcon
          className='svg--cursor svg--scale'
          onClick={() => {
            handleToggleFavorite('favorite');
          }}
        />
      )}
    </div>
  );
}

function CellAction(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: streamState,
    actions: streamAction,
    dispatch: streamDispatch
  } = useContext(StreamContext);

  const current = streamState.queue[streamState.currentSong];
  const { serial, id, collectionId, type } = props;

  const handlePause = () => {
    streamDispatch(streamAction.requestPaused(true));
  };
  const handlePlay = () => {
    if (id === current && collectionId === streamState.collectionId) {
      streamDispatch(streamAction.requestPaused(false));
    } else {
      if (collectionId === streamState.collectionId) {
        streamDispatch(streamAction.reorder(id));
      } else {
        streamCollection(authState.token, type, collectionId)
          .then(res => {
            if (res.status === 'success') {
              streamDispatch(
                streamAction.start({
                  queue: res.data,
                  playType: type,
                  collectionId
                })
              );
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  };

  return (
    <div className='collection-table__cell collection-table__cell--action'>
      <span>{serial}</span>
      <div className='action'>
        <ButtonIcon>
          {id === current && !streamState.paused ? (
            <PauseIcon onClick={handlePause} />
          ) : (
            <PlayIcon onClick={handlePlay} />
          )}
        </ButtonIcon>
      </div>
    </div>
  );
}

export default CollectionTrackTable;
