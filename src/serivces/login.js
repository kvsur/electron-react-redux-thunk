import request from '../utils/request';

export const auth = body => request(`/user/login`, {
    method: 'POST',
    body,
})