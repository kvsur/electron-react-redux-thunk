import request from '@/utils/request';

// 获取教室信息
export const fetchClassInfo = params => request(`/class/getInfo`, {
    method: 'POST',
    body: {
        ...params
    }
});

// 获取今日的作息时间表
export const fetchClassSchedule = params => request(`/class/getClassSchedule`, {
    method: 'POST',
    body: {
        ...params
    }
});

// 开始上课
export const classStart = params => request(`/class/classStart`, {
    method: 'POST',
    body: {
        ...params
    }
});

// 确认下课
export const classEnd = params => request(`/class/classEnd`, {
    method: 'POST',
    body: {
        ...params
    }
});
