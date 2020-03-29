import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AudioStream from '../utils/AudioStream';
import { getStreamInfo } from '../apis/StreamAPI';
import { AuthContext } from './AuthContext';
import { reorder, shuffle, swap, getCircularIndex } from '../utils/Common';

const StreamContext = createContext();

const stream = new AudioStream();

const initState = {
  queue: [
    // '3AUo1uunXOxigzt6JIsZ',
    // '5UmNONJQaXmNmbdmr2On',
    // 'gKen4p6Y37lf2OkVuMNg'
  ],
  queueSrc: [
    // '3AUo1uunXOxigzt6JIsZ',
    // '5UmNONJQaXmNmbdmr2On',
    // 'gKen4p6Y37lf2OkVuMNg'
  ],
  queueExtra: [],
  currentSongIndex: 0,
  mainQueueMarkIndex: 0,
  playFromId: '',
  playFromType: '', // 'playlist' or 'release' or 'favorite'
  info: {},
  volume: 50,
  muted: false,
  paused: true,
  repeat: 'none',
  shuffled: false,
  settings: {
    bitrate: '128',
    shouldPlay: false
  }
};

function StreamContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState, () => {
    let settings = localStorage.getItem('settings');
    if (settings) {
      return {
        ...initState,
        settings: JSON.parse(settings)
      };
    }

    return initState;
  });

  const { state: authState } = useContext(AuthContext);

  // init stream states
  useEffect(() => {
    stream.onInfo = info => {
      dispatch(actions.setInfo(info));
    };
    stream.onTogglePaused = paused => {
      dispatch(actions.onTogglePaused(paused));
    };
    if (state.settings)
      localStorage.setItem('settings', JSON.stringify(state.settings));
  }, []);

  useEffect(() => {
    stream.api = (id, bitrate) => {
      return getStreamInfo(authState.token, id, bitrate);
    };
  }, [authState.token]);

  //
  useEffect(() => {
    stream.onEnded = () => {
      switch (state.repeat) {
        case 'none':
          if (state.currentSongIndex < state.queue.length - 1) {
            dispatch(actions.skipForward(true));
          }
          break;
        case 'one':
          dispatch(actions.repeatTrack());
          break;
        case 'all':
          dispatch(actions.skipForward(true));
          break;
        default:
      }
    };
  }, [state.currentSongIndex, state.repeat, state.queue]);

  return (
    <StreamContext.Provider value={{ state, actions, dispatch, stream }}>
      {props.children}
    </StreamContext.Provider>
  );
}

const actions = {
  init: payload => {
    return {
      type: 'INIT',
      payload
    };
  },
  start: (queue, playFromType, playFromId, targetTrackId) => {
    return {
      type: 'START',
      payload: {
        queue,
        playFromType,
        playFromId,
        targetTrackId
      }
    };
  },
  addToQueue: extra => {
    return {
      type: 'ADD_TO_QUEUE',
      extra
    };
  },
  repeatTrack: () => {
    return { type: 'REPEAT_TRACK' };
  },
  reorder: trackId => {
    return {
      type: 'REORDER',
      trackId
    };
  },
  skipBackward: payload => {
    return {
      type: 'SKIP_BACKWARD',
      payload
    };
  },
  skipForward: payload => {
    return {
      type: 'SKIP_FORWARD',
      payload
    };
  },
  togglePaused: () => {
    return {
      type: 'TOGGLE_PAUSED'
    };
  },
  onTogglePaused: paused => {
    return {
      type: 'ON_TOGGLE_PAUSED',
      paused
    };
  },
  seek: per => {
    return {
      type: 'SEEK',
      per
    };
  },
  volume: per => {
    return {
      type: 'VOLUME',
      per
    };
  },
  setMuted: muted => {
    return {
      type: 'SET_MUTED',
      muted
    };
  },
  setRepeat: repeat => {
    return {
      type: 'SET_REPEAT',
      repeat
    };
  },
  setShuffle: shuffled => {
    return {
      type: 'SET_SHUFFLE',
      shuffled
    };
  },
  setInfo: info => {
    return {
      type: 'SET_INFO',
      info
    };
  },
  clean: () => {
    return { type: 'CLEAN' };
  },
  setTrackFavorite: (id, relation) => {
    return {
      type: 'SET_TRACK_FAVORITE',
      payload: {
        id,
        relation
      }
    };
  },
  setSettings: settings => {
    return { type: 'SET_SETTINGS', settings };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      let { payload } = action;
      stream.init(
        payload.audio,
        payload.onProgress,
        payload.onDurationChange,
        state.settings
      );
      return state;
    }
    case 'START': {
      let { payload } = action;
      let { queue } = payload;
      if (payload.targetTrackId) {
        queue = reorder(queue, queue.indexOf(payload.targetTrackId));
      }
      stream.continue(queue[0], true);
      return {
        ...state,
        queue: [...queue],
        queueSrc: [...queue],
        playFromType: payload.playFromType,
        playFromId: payload.playFromId,
        currentSongIndex: 0
      };
    }
    case 'ADD_TO_QUEUE': {
      if (!state.queue.length && !state.queueExtra.length)
        stream.start(action.extra[0], stream.settings.shouldPlay);
      return {
        ...state,
        queueExtra: [...state.queueExtra, ...action.extra]
      };
    }
    case 'REPEAT_TRACK': {
      stream.continue(state.queue[state.currentSongIndex]);
      return state;
    }
    case 'REORDER': {
      let targetIndex = state.queue.indexOf(action.trackId);
      let queue = swap(state.queue, state.currentSongIndex, targetIndex);
      stream.continue(queue[state.currentSongIndex]);
      return {
        ...state,
        queue
      };
    }
    case 'SKIP_BACKWARD': {
      if (!state.queue.length && !state.queueExtra.length) return state;

      let shouldPlay = !state.paused;
      // when reachs the end of the song
      if (!shouldPlay) {
        if (action.payload) {
          shouldPlay = action.payload;
        }
      }

      let backwardId = getCircularIndex(
        state.currentSongIndex - 1,
        state.queue.length
      );

      const { queue, queueExtra } = state;
      if (queueExtra.length && backwardId === state.mainQueueMarkIndex) {
        let queueTemp = [...queueExtra];
        let nextTrack = queueTemp.pop();
        stream.start(nextTrack, shouldPlay);

        return {
          ...state,
          queueExtra: queueTemp
        };
      } else {
        stream.start(queue[backwardId], shouldPlay);

        return {
          ...state,
          currentSongIndex: backwardId
        };
      }
    }
    case 'SKIP_FORWARD': {
      if (!state.queue.length && !state.queueExtra.length) return state;

      let shouldPlay = !state.paused;
      // when reachs the end of the song
      if (!shouldPlay) {
        if (action.payload) {
          shouldPlay = action.payload;
        }
      }

      const { queue, queueExtra } = state;
      if (queueExtra.length) {
        let queueTemp = [...queueExtra];
        let nextTrack = queueTemp.shift();
        stream.start(nextTrack, shouldPlay);

        return {
          ...state,
          queueExtra: queueTemp,
          mainQueueMarkIndex: state.currentSongIndex
        };
      } else {
        let forwardId = getCircularIndex(
          state.currentSongIndex + 1,
          state.queue.length
        );
        stream.start(queue[forwardId], shouldPlay);

        return {
          ...state,
          currentSongIndex: forwardId
        };
      }
    }
    case 'TOGGLE_PAUSED':
      stream.togglePaused();
      return state;
    case 'ON_TOGGLE_PAUSED':
      return {
        ...state,
        paused: action.paused
      };
    case 'SEEK':
      stream.seek(action.per);
      return state;
    case 'VOLUME':
      const { per: volume } = action;
      stream.volume(volume);
      stream.toggleMute(false);
      if (volume !== 0) return { ...state, volume, muted: false };
      else return { ...state, muted: true };
    case 'SET_MUTED':
      const { muted } = action;
      if (!muted) stream.volume(state.volume);
      stream.toggleMute(muted);
      return { ...state, muted };
    case 'SET_REPEAT':
      return { ...state, repeat: action.repeat };
    case 'SET_SHUFFLE':
      if (state.queue.length) {
        let { shuffled } = action;

        if (shuffled) {
          let queue = reorder(state.queue, state.currentSongIndex);
          queue = [queue[0], ...shuffle(queue.slice(1))];
          return { ...state, queue, currentSongIndex: 0, shuffled };
        } else {
          let currentSong = state.queue[state.currentSongIndex];
          let currentSongIndex = state.queueSrc.indexOf(currentSong);
          return {
            ...state,
            queue: [...state.queueSrc],
            currentSongIndex,
            shuffled
          };
        }
      }
      return state;
    case 'SET_INFO':
      return {
        ...state,
        info: action.info
      };
    case 'CLEAN':
      stream.clean();
      return state;
    case 'SET_TRACK_FAVORITE': {
      const { payload } = action;
      if (state.info.id === payload.id) {
        return {
          ...state,
          info: {
            ...state.info,
            relation: payload.relation
          }
        };
      }

      return state;
    }
    case 'SET_SETTINGS': {
      stream.setSettings(action.settings);
      let newSettings = { ...state.settings, ...action.settings };
      localStorage.setItem('settings', JSON.stringify(newSettings));
      return { ...state, settings: newSettings };
    }
    default:
      return state;
  }
};

export { StreamContext };
export default StreamContextProvider;
