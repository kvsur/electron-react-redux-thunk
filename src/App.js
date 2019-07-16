import React, { Component } from 'react';
import { Route, } from 'react-router-dom';
import { Provider } from 'react-redux';

import Router from '@/router-dom';
// import Header from '@/components/Header';
import Home from '@/pages/Home';
import store from '@/store';

import history from '@/router-dom/history';


import styles from '@/App.less';
import Header from '@/components/Header';

class App extends Component {
  state = {};

  render() {
    return (
      <Provider store={store}>
        <main className={styles.main}>
          <Router history={history}>
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/home" component={Home} />
          </Router>
        </main>
      </Provider>
    );
  }
}

export default App;
