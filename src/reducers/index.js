/**
 * Created by LeeCH at July 4th, 2019 4:46pm
 */
import { combineReducers } from 'redux';

import login from './login';
import user from './user';
import department from './department';
import home from './home';
import lesson from './lesson';
import global from './global';

export default combineReducers({
    login,
    user,
    department,
    home,
    lesson,
    global,
});
