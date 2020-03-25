import React from 'react';
import { UserRoute } from '../../../components/custom-routes';
import { NavigationTab } from '../../../components/navigation';
import { TemplateNavPage } from '../template';
import General from './General';
import Genres from './Genres';
import Releases from './Releases';

function Browse(props) {
  const header = (
    <div className='browse-header fadein'>
      <span className='font-short-extra font-weight-bold font-white'>
        Browse
      </span>
    </div>
  );

  const nav = (
    <NavigationTab
      items={[
        { href: '/player/browse', label: 'General' },
        { href: '/player/browse/genres', label: 'Genres' },
        { href: '/player/browse/releases', label: 'New releases' }
      ]}
    />
  );

  const body = (
    <React.Fragment>
      <UserRoute exact path='/player/browse' component={General} />
      <UserRoute exact path='/player/browse/genres' component={Genres} />
      <UserRoute exact path='/player/browse/releases' component={Releases} />
    </React.Fragment>
  );

  return <TemplateNavPage header={header} nav={nav} body={body} />;
}

export default Browse;
