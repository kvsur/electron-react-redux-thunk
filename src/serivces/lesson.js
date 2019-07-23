import request from '@/utils/request';
import { BASE_API } from '../constants/COMMON_ACTION_TYPES';

// 获取今日的作息时间表
export const getClassSchedule = params => request(`${BASE_API}/getClassSchedule`, {
    method: 'POST',
    body: {
        ...params
    }
});

// 开始上课
export const classStart = params => request(`${BASE_API}/classStart`, {
    method: 'POST',
    body: {
        ...params
    }
});

// 确认下课
export const classEnd = params => request(`${BASE_API}/classEnd`, {
    method: 'POST',
    body: {
        ...params
    }
});
