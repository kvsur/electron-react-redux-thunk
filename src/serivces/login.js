import request from '@/utils/request';
import { BASE_API } from '../constants/COMMON_ACTION_TYPES';

export const auth = body => request(`${BASE_API}/login`, {
    method: 'POST',
    body,
})