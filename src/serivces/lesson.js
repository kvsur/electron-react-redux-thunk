import request from '@/utils/request';

export const getGradeList = params => request('/system/grade/list', {
    method: 'POST',
    body: {
        ...params
    }
})
