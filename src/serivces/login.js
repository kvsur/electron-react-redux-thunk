import request from '@/utils/request';

export const auth = params => request('https://www.baidu.com/', {
    method: 'GET',
})