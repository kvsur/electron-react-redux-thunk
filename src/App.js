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

import Bridge from './utils/bridge';
import { message } from 'antd';

const isDevelopment = process.env.NODE_ENV === 'development';

class App extends Component {
  state = {};

  componentDidMount() {
    Bridge.send('check-update');
    Bridge.on('update-message', this.showUpdateMessage);
    Bridge.on('download-progress', this.dealProgress);
    Bridge.on('update-now', this.updateNow);
  }

  componentWillUnmount() {
    Bridge.cancel('update-message', this.showUpdateMessage);
    Bridge.cancel('download-progress', this.dealProgress);
    Bridge.cancel('update-now', this.updateNow);
  }

  updateNow = () => {
    Bridge.send('update-now');
  }

  showUpdateMessage = msg => {
    message.warning(msg);
  }

  dealProgress = progressObj => {
    // const { transferred, total, bytesPerSecond, } = progressObj;
    console.log(...progressObj);
  }

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
