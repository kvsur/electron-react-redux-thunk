import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Header from '@/components/Header';
import Home from '@/pages/Home';
import store from '@/store';


import styles from './App.less';

class App extends Component {
  state = {};

  render() {
    return (
      <Provider store={store}>
        <main className={styles.main}>
          <Router>
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
