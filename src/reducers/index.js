import { combineReducers } from 'redux';

import login from './login';
import user from './user';
import department from './department';
import home from './home';

export default combineReducers({
    login,
    user,
    department,
    home,
});
