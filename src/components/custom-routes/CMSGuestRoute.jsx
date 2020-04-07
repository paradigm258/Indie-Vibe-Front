import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext, MeContext } from '../../contexts';

function CMSGuestRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);
  const { role } = useContext(MeContext).state;

  return (
    <Route
      {...rest}
      render={props => {
        if (!state.token) {
          return <Component {...props} />;
        } else if (role.id === 'r-admin') {
          return (
            <Redirect
              to={{
                pathname: '/cms',
                state: props.location
              }}
            />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: '/home',
                state: props.location
              }}
            />
          );
        }
      }}
    />
  );
}

export default CMSGuestRoute;
