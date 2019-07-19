import { auth } from '../serivces/login';

export const login = ({ userAccount, password}) => {
    return async dispatch => {
        console.log(userAccount, password);
        try {
            await auth();
            return Promise.resolve();
        } catch(e) {
            console.error(e);
            return Promise.reject();
        }
    }
}