import React, { Component } from 'react';
import { Route, } from 'react-router-dom';
import { Provider } from 'react-redux';

import Router from '@/router-dom';
// import Header from '@/components/Header';
import Login from '@/pages/Login';
import store from '@/store';

import history from '@/router-dom/history';


import styles from '@/App.less';
import Header from '@/components/Header';

const isDevelopment = process.env.NODE_ENV === 'development';

class App extends Component {
  state = {};

  render() {
    return (
      <Provider store={store}>
        <main className={styles.main}>
          <Router history={history}>
            { isDevelopment ? null : <Header />}
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
          </Router>
        </main>
      </Provider>
    );
  }
}

export default App;
