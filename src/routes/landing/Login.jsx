import React, { useState, useContext } from 'react';

import { InputForm, Checkbox } from '../../components/inputs';
import {
  ButtonMain,
  ButtonFacebook,
  ButtonFrame
} from '../../components/buttons';
import Authentication from './Authentication';
import { login } from '../../apis';
import ErrorCard from '../../components/cards/ErrorCard';
import { AuthContext } from '../../contexts';

import { LogoSignIn } from '../../assets/svgs';
import './style.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [remembered, setRemembered] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const { actions, dispatch } = useContext(AuthContext);
  const { loginSuccess } = actions;

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePwdChange = e => {
    setPwd(e.target.value);
  };

  const handleRememberedChange = e => {
    setRemembered(e.target.checked);
  };

  const handleLogIn = () => {
    setSubmitted(true);
    setLoginError('');
    if (!email || !pwd) return;

    setLoggingIn(true);
    login(email, pwd)
      .then(response => {
        if (response.status !== 200) throw 'Wrong email or password!';
        return response.json();
      })
      .then(json => {
        dispatch(loginSuccess({ ...json, remembered }));
      })
      .catch(err => {
        setPwd('');
        setLoginError(err);
      });
  };

  const responseFacebook = response => {
    console.log(response);
  };

  const logo = () => <LogoSignIn height='60' />;

  const inputs = () => (
    <React.Fragment>
      {loginError ? <ErrorCard message={loginError} /> : ''}
      <InputForm
        type='text'
        placeholder='Your email address'
        onChange={handleEmailChange}
        error={email === '' && submitted}
        errMessage='Email required'
        value={email}
      />

      <InputForm
        type='password'
        placeholder='Your password'
        onChange={handlePwdChange}
        error={pwd === '' && submitted}
        errMessage='Please enter your password'
        value={pwd}
      />

      <div className='input-addition input-addition-span'>
        <Checkbox label='Remember me' onChange={handleRememberedChange} />
        <a
          href='#'
          className='font-tall-r font-weight-bold font-blue-main link link-bright-blue-main'
        >
          Forgot your password?
        </a>
      </div>
    </React.Fragment>
  );

  const submits = () => (
    <React.Fragment>
      <ButtonMain isFitted={false} onClick={handleLogIn} disabled={loggingIn}>
        Enter
      </ButtonMain>
      <div
        style={{ padding: '7px', textAlign: 'center' }}
        className='font-short-regular font-weight-bold font-gray-light'
      >
        or
      </div>
      <ButtonFacebook isFitted={false} responseFacebook={responseFacebook}>
        Sign in with Facebook
      </ButtonFacebook>
    </React.Fragment>
  );

  const addition = () => (
    <React.Fragment>
      <div
        style={{ textAlign: 'center', padding: '10px' }}
        className='font-short-regular font-weight-bold font-white'
      >
        Not a member yet?
      </div>
      <a href='/register'>
        <ButtonFrame isFitted={true}>Join Indie Vibe</ButtonFrame>
      </a>
    </React.Fragment>
  );

  return (
    <Authentication
      logo={logo()}
      inputs={inputs()}
      submits={submits()}
      addition={addition()}
    />
  );
}

export default Login;
