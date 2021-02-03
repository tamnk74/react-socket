import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from 'components/NotFound';
import wrapDefaultLayout from 'components/layouts/default';
import { HomePage } from 'features/Home';
import { SignIn, SignUp } from 'features/Auth/pages';

const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={wrapDefaultLayout(HomePage)} />
    <Route exact={true} path="/login" component={wrapDefaultLayout(SignIn)} />
    <Route exact={true} path="/signup" component={wrapDefaultLayout(SignUp)} />
    <Route component={wrapDefaultLayout(NotFound)} />
  </Switch>
);

export default Routes;
