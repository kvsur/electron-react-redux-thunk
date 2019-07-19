import React, { Component } from 'react';
import { Route, } from 'react-router-dom';
import { Provider } from 'react-redux';

import Router from './router-dom';
// import Header from './components/Header';
import store from './store';
import Login from './pages/Login';
import Lesson from './pages/Lesson';
import Ending from './pages/Ending';

import history from './router-dom/history';


import styles from './App.less';
import Header from './components/Header';

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
            <Route path="/lesson" component={Lesson} />
            <Route path="/ending" component={Ending} />
          </Router>
        </main>
      </Provider>
    );
  }
}

export default App;
