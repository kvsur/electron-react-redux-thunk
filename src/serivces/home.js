import request from '@/utils/request';

export const getModel = params => request('http://www.mocky.io/v2/5d1da1033000003745d7203a', {
    method: 'POST',
    body: {
        ...params
    }
})
