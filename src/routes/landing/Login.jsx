import React, { useContext, useState } from 'react';
import { login } from '../../apis';
import { loginFb } from '../../apis/AuthAPI';
import { LogoSignIn } from '../../assets/svgs';
import {
  ButtonFacebook,
  ButtonFrame,
  ButtonMain
} from '../../components/buttons';
import { CardError } from '../../components/cards';
import { InputCheckbox, InputForm } from '../../components/inputs';
import { AuthContext } from '../../contexts';
import Authentication from './Authentication';

function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [remembered, setRemembered] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingInFb, setLoggingInFb] = useState(false);

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

  const handleLogIn = e => {
    e.preventDefault();
    setSubmitted(true);
    setLoginError('');
    if (!email || !pwd) return;

    setLoggingIn(true);
    login(email, pwd)
      .then(response => {
        if (response.status !== 200) throw 'wrong';

        return response.json();
      })
      .then(json => {
        dispatch(loginSuccess({ ...json, remembered }));
      })
      .catch(err => {
        if (err === 'wrong') setLoginError('Wrong email or password');
        else setLoginError('Server error');

        setPwd('');
        setLoggingIn(false);
      });
  };

  const handleLogInFb = () => {
    setLoggingInFb(true);
  };

  const responseFacebook = response => {
    const { status } = response;
    if (status && status !== 'connected') {
      setLoggingInFb(false);
      return;
    }

    const { id, accessToken } = response;
    loginFb(id, accessToken)
      .then(response => response.json())
      .then(json => {
        if (json.status && json.status === 'fail') {
          throw 'wrong';
        } else {
          dispatch(loginSuccess({ ...json, remembered }));
        }

        setLoggingInFb(false);
      })
      .catch(err => {
        if (err === 'wrong') setLoginError('Facebook account is not connected');
        else setLoginError('Server error');

        setLoggingInFb(false);
      });
  };

  const logo = () => <LogoSignIn height='60' />;

  const inputs = () => (
    <form onSubmit={handleLogIn}>
      {loginError ? <CardError message={loginError} /> : ''}
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
        <InputCheckbox label='Remember me' onChange={handleRememberedChange} />
        <a
          href='#'
          className='font-tall-r font-weight-bold font-blue-main link link-bright-blue-main'
        >
          Forgot your password?
        </a>
      </div>
      <input type='submit' style={{ display: 'none' }}></input>
    </form>
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
      <ButtonFacebook
        isFitted={false}
        responseFacebook={responseFacebook}
        onClick={handleLogInFb}
        disabled={loggingInFb}
      >
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
