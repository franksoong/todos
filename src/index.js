import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import configureStore from './configureStore';

import './assets/scss/my.scss';


const store = configureStore();
render(
  <Root store={store} />,
  document.getElementById('root')
);
