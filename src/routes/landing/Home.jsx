import React from 'react';

import { ButtonFrame, ButtonMain } from '../../components/buttons';
import Landing from './Landing';

import './style.scss';
import cell1 from '../../assets/imgs/cell-1.png';
import cell2 from '../../assets/imgs/cell-2.png';
import cell3 from '../../assets/imgs/cell-3.png';
import cell4 from '../../assets/imgs/cell-4.png';
import cell5 from '../../assets/imgs/cell-5.png';
import cell6 from '../../assets/imgs/cell-6.png';
import LandingIntro from '../../assets/imgs/landing-intro.png';

function Home() {
  const intro = (
    <div className='content'>
      <div className='intro-body'>
        <img src={LandingIntro} width='300px' />
        <div className='intro-text'>
          <div className='font-banner font-white pb-4'>
            Vibe your music freedom
          </div>
          <div className='d-flex align-items-center'>
            <a href='/player'>
              <ButtonMain label='Join free' />
            </a>
            <div className='pl-4 font-tip font-gray-light'>
              No credit card requried
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const body = (
    <div className='content'>
      <div className='container body-grid'>
        <div className='row pb-5'>
          <a href='#' className='col-md-3'>
            <img src={cell1} />
          </a>
          <div className='col-md-6 text-center'>
            <h4 className='pt-4 pb-4 font-white'>
              Million of songs ready to be discovered
            </h4>
            <div className='pb-4'>
              <a href='/register'>
                <ButtonFrame label='Sign up' />
              </a>
            </div>
            <h4 className='pb-4 font-white'>Become and Artist</h4>
          </div>
          <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
            <img src={cell2} />
          </a>
        </div>
        <div className='row'>
          <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
            <img src={cell3} />
          </a>
          <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
            <img src={cell4} />
          </a>
          <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
            <img src={cell5} />
          </a>
          <a href='#' className='col-md-3 pb-sm-3 pb-md-0'>
            <img src={cell6} />
          </a>
        </div>
      </div>
    </div>
  );

  return <Landing intro={intro} body={body} />;
}

export default Home;
