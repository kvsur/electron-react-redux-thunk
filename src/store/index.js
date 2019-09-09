/**
 * Created by LeeCH at July 4th, 2019 4:46pm
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import combineReducers from '@/reducers';
import initState from './initState';

const store = createStore(combineReducers, initState, compose(applyMiddleware(thunk)));

export default store;
