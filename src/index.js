import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { register } from './serviceWorker';
import configureStore from './store/configureStore';
const store = configureStore();

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
register({
  ENV: 'development',
  PUBLIC_URL: 'http://localhost:4200',
});
