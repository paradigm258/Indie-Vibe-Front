import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BrowseIcon, HomeIcon, LibraryIcon, Logo } from '../../assets/svgs';
import { ButtonFrame } from '../../components/buttons';
import { NavLinkColor } from '../../components/links';
import { AuthContext, MeContext } from '../../contexts';

function NavMenu() {
  const { state: authState } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;

  return (
    <div className='nav-menu'>
      <div className='banner'>
        <section className='logo-wrapper'>
          <a href='/home'>
            <Logo className='logo' />
          </a>
        </section>

        {role.id === 'r-free' ? (
          <section className='upgrade'>
            <a href='/premium'>
              <ButtonFrame full>UPGRADE</ButtonFrame>
            </a>
          </section>
        ) : (
          ''
        )}
      </div>
      <ul className='menu'>
        <li>
          <NavLinkColor
            href={['/player', '/player/home']}
            className='font-short-big font-weight-bold font-white'
            shallow={true}
          >
            <HomeIcon />
            Home
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor
            href={['/player/browse', '/player/genre']}
            className='font-short-big font-weight-bold font-white'
          >
            <BrowseIcon />
            Browse
          </NavLinkColor>
        </li>
        <li>
          <NavLinkColor
            href={`/player/library/${authState.id}`}
            className='font-short-big font-weight-bold font-white'
          >
            <LibraryIcon />
            Library
          </NavLinkColor>
        </li>
      </ul>
      <div className='quick-menu'>
        <Link
          to={`/player/library/${authState.id}/artists`}
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Artist
        </Link>
        <Link
          to={`/player/library/${authState.id}/releases`}
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Releases
        </Link>
        <Link
          to={`/player/library/${authState.id}/tracks`}
          className='link-bright-gray font-short-regular font-gray-light'
        >
          Favorite songs
        </Link>
      </div>
      <div className='artist-box'>
        {role.id === 'r-artist' ? (
          <NavLink to='/player/workspace'>
            <ButtonFrame full>Your workspace</ButtonFrame>
          </NavLink>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default NavMenu;
