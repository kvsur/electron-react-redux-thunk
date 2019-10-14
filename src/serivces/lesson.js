import request from '@/utils/request';

export const fetchClassSchedule = params => request(`/class/getClassSchedule`, {
    method: 'POST',
    body: {
        ...params
    }
});

export const classStart = params => request(`/class/classStart`, {
    method: 'POST',
    body: {
        ...params
    }
});

export const classEnd = params => request(`/class/classEnd`, {
    method: 'POST',
    body: {
        ...params
    }
});
