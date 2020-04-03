import React, { useContext } from 'react';
import AvatarPlaceholder from '../../../assets/imgs/avatar-placeholder.jpg';
import { ArrowDown, Logo } from '../../../assets/svgs';
import { ButtonFrame } from '../../../components/buttons';
import { ContextMenuAccount } from '../../../components/context-menu';
import { LinkWhiteColor } from '../../../components/links';
import { AuthContext, MeContext } from '../../../contexts';

function NavBar(props) {
  const { state: authState } = useContext(AuthContext);
  const { state: meState } = useContext(MeContext);

  return (
    <div className='content'>
      <div className='nav-left'>
        <div className='nav-left__logo'>
          <a href='/home'>
            <Logo />
          </a>
        </div>
        <nav className='nav-left__menu-container'>
          <ul className='nav-left__menu'>
            <li className='nav-menu__item'>
              <LinkWhiteColor
                href='/home'
                className='font-short-regular font-weight-bold font-white'
                active={props.active === 'home'}
              >
                Home
              </LinkWhiteColor>
            </li>
            <li className='nav-menu__item'>
              <LinkWhiteColor
                href='/premium'
                className='font-short-regular font-weight-bold font-white'
                active={props.active === 'premium'}
              >
                Premium
              </LinkWhiteColor>
            </li>
            <li className='nav-menu__item'>
              <LinkWhiteColor
                href='#'
                className='font-short-regular font-weight-bold font-white'
              >
                About
              </LinkWhiteColor>
            </li>
          </ul>
        </nav>
      </div>
      <div className='nav-right'>
        {!authState.token ? (
          <React.Fragment>
            <a href='/register'>
              <ButtonFrame isFitted={true}>Register</ButtonFrame>
            </a>
            <div className='nav-menu__item'>
              <LinkWhiteColor
                href='/login'
                className='font-short-regular font-weight-bold font-white'
              >
                Sign in
              </LinkWhiteColor>
            </div>
          </React.Fragment>
        ) : (
          <div className='dropdown'>
            <div className='user-box' data-toggle='dropdown'>
              <div className='thumbnail-wrapper'>
                <img
                  src={
                    meState.thumbnail ? meState.thumbnail : AvatarPlaceholder
                  }
                />
              </div>
              <span className='font-short-regular font-weight-bold font-white pl-2'>
                {meState.displayName}
              </span>
              <ArrowDown />
            </div>
            <div className='dropdown-menu'>
              <div className='context-wrapper'>
                <ContextMenuAccount fromLanding={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
