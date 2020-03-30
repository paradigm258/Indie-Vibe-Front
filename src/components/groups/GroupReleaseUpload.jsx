import React, { useState, useEffect, useRef, useContext } from 'react';

import { InputForm, InputFileLabel } from '../inputs';
import { ButtonMain, ButtonFrame } from '../buttons';
import {
  getGenresList,
  publishRelease,
  getReleaseTypeList
} from '../../apis/API';
import { AuthContext } from '../../contexts';
import { GroupTrackUpload } from '../groups';
import { CardSuccess, CardError } from '../cards';

import Placeholder from '../../assets/imgs/placeholder.png';

const infoModel = {
  title: '',
  genres: [],
  producer: ''
};
const audioModel = {
  audio128: null,
  audio320: null
};
const missingSomething = (info, audio) => {
  return (
    info.some(track => track.title === '' || track.genres.length === 0) ||
    audio.some(a => !a.audio128 || !a.audio320)
  );
};
function GroupReleaseUpload() {
  const { state: authState } = useContext(AuthContext);

  const [release, setRelease] = useState({ title: '', typeId: 're-album' });
  const [info, setInfo] = useState([Object.assign({}, infoModel)]);
  const [thumbnail, setThumbnail] = useState(null);
  const [audio, setAudio] = useState([Object.assign({}, audioModel)]);

  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [audioSrc, setAudioSrc] = useState([Object.assign({}, audioModel)]);
  const [releaseTypeList, setReleaseTypeList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [publishing, setPublishing] = useState(0);
  const [success, setSuccess] = useState(false);

  const thumbnailRef = useRef();

  useEffect(() => {
    getGenresList(authState.token)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          setGenreList(res.data);
        }
      });

    getReleaseTypeList(authState.token)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          setReleaseTypeList(res.data);
        }
      });
  }, []);

  useEffect(() => {
    let successTimeout;
    let failTimeout;
    if (publishing === 2) {
      if (success) {
        successTimeout = setTimeout(() => {
          window.location.href = '/player/workspace';
        }, 1000);
      } else {
        failTimeout = setTimeout(() => {
          setPublishing(0);
        }, 1000);
      }
    }

    return () => {
      clearTimeout(successTimeout);
      clearTimeout(failTimeout);
    };
  }, [publishing]);

  const handleThumbnailChange = () => {
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

  const handleReleaseChange = e => {
    setRelease({
      ...release,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleItemChange = (index, newInfo, newAudio, newAudioSrc) => {
    setInfo(
      info.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newInfo
          };
        }

        return item;
      })
    );
    setAudio(
      audio.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newAudio
          };
        }

        return item;
      })
    );
    setAudioSrc(
      audioSrc.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            ...newAudioSrc
          };
        }

        return item;
      })
    );
  };

  const handleItemDelete = index => {
    setInfo(info.filter((item, i) => index !== i));
    setAudio(audio.filter((item, i) => index !== i));
    setAudioSrc(audioSrc.filter((item, i) => index !== i));
  };

  const handleAddSong = () => {
    setInfo([...info, { ...infoModel }]);
    setAudio([...audio, { ...audioModel }]);
    setAudioSrc([...audioSrc, { ...audioModel }]);
  };

  const handlePublish = () => {
    setSubmitted(false);
    if (!release.title || !thumbnail || missingSomething(info, audio)) {
      console.log('missing');
      setSubmitted(true);
      return;
    }

    let resInfo = { ...release };
    let tracks = info.map(track => ({
      title: track.title,
      producer: track.producer,
      genres: track.genres.map(g => g.id)
    }));
    resInfo = { ...resInfo, tracks };

    setPublishing(1);
    publishRelease(authState.token, resInfo, thumbnail, audio)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          setSuccess(true);
        }
        setPublishing(2);
      });
  };

  return (
    <div className='release-upload'>
      {publishing ? (
        <div className='upload-layer'>
          <span className='font-short-extra font-weight-bold font-white'>
            {publishing === 1 ? (
              'Pulbishing...'
            ) : success ? (
              <CardSuccess message='Your release has been published' />
            ) : (
              <CardError message='Failed to publish' />
            )}
          </span>
        </div>
      ) : (
        ''
      )}
      <div className='upload-cover-wrapper'>
        <input
          ref={thumbnailRef}
          type='file'
          name='thumbnail'
          id='thumbnail'
          className='input-custom'
          onChange={handleThumbnailChange}
          accept='image/*'
        />
        <InputFileLabel
          for='thumbnail'
          error={submitted && !thumbnail}
          keep={true}
          className='input-custom__label--img'
        >
          <img src={thumbnailSrc ? thumbnailSrc : Placeholder} />
        </InputFileLabel>
      </div>
      <div className='upload-content'>
        <div className='upload-item upload-header'>
          <InputForm
            placeholder='Enter release title'
            onChange={handleReleaseChange}
            name='title'
            value={release.title}
            error={submitted && !release.title}
            errMessage='Missing release title'
          />
          <select
            name='typeId'
            className='custom-select release-type'
            onChange={handleReleaseChange}
          >
            {releaseTypeList.map((releaseType, index) => (
              <option value={releaseType.id} key={index}>
                {releaseType.name}
              </option>
            ))}
          </select>
        </div>
        <div className='upload-body'>
          {info.map((track, index) => (
            <div className='upload-item' key={index}>
              <GroupTrackUpload
                index={index}
                handleItemChange={handleItemChange}
                handleItemDelete={handleItemDelete}
                info={info[index]}
                audio={audio[index]}
                audioSrc={audioSrc[index]}
                genreList={genreList}
                submitted={submitted}
              />
            </div>
          ))}

          <ButtonMain onClick={handleAddSong}>ADD SONG</ButtonMain>
        </div>
      </div>
      <div>
        <ButtonFrame onClick={handlePublish}>Publish</ButtonFrame>
      </div>
    </div>
  );
}

export default GroupReleaseUpload;
