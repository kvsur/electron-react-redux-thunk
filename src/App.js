import React, { Component } from 'react';
import { Route, } from 'react-router-dom';
import { Provider } from 'react-redux';

import Router from './router-dom';
import store from './store';
import Login from './pages/Login';
import Lesson from './pages/Lesson';
import Ending from './pages/Ending';
import history from './router-dom/history';
import styles from './App.less';
import Header from './components/Header';
import Updater from './components/Update';

const isProduction = process.env.NODE_ENV === 'development';
const isPlatformWin = process.env.APP_PLATFORM === 'win';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <main className={styles.main}>
          <Router history={history}>
            {isProduction && isPlatformWin ? <Header /> : null}
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/lesson" component={Lesson} />
            <Route path="/ending" component={Ending} />
          </Router>
          {process.env.NODE_ENV === 'production' ? <Updater /> : null}
        </main>
      </Provider>
    );
  }
}

export default App;
