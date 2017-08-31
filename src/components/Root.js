import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
      <Route path="/(:filter)" component={App} >
      {
         // for complex route case please check: git@github.com:franksoong/express-react-redux-starter.git
         // <IndexRoute component={Home} />;
         // <Route path="/about" component={About} />
      }
      </Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
