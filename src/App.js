import React, { Component } from 'react';
import { Route, } from 'react-router-dom';
import { Provider } from 'react-redux';

import Router from './router-dom';
import store from './store';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Lesson from './pages/Lesson';
import Ending from './pages/Ending';
import history from './router-dom/history';
import styles from './App.less';
import Header from './components/Header';
import Updater from './components/Update';
import Logo from './components/Logo';
import CopyRight from './components/CopyRight';
// import Ping from './components/Ping';
// import Initial from './components/Initial';
import Authorize from './components/Authorize';

const isProduction = process.env.NODE_ENV === 'production';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <main className={styles.main}>
          <Router history={history}>
            {/* {isProduction ? <Header /> : null} */}
            {/* <Initial /> */}
            <Header />
            <Logo />
            <Route path="/" exact component={Loading} />
            <Route path="/loading" component={Loading} />
            <Route path="/login" component={Login} />
            <Route path="/lesson" component={Lesson} />
            <Route path="/ending" component={Ending} />
            <Authorize />
            <CopyRight />
            {/* <Ping /> */}
          </Router>
          {isProduction ? <Updater /> : null}
        </main>
      </Provider>
    );
  }
}

export default App;
