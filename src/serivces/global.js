import request from '@/utils/request';

export const doPingApi = () => request(`/tool/ping`, {
    method: 'GET',
});

export const fetchClassInfo = params => request(`/class/getInfo`, {
    method: 'POST',
    body: {
        ...params
    }
});

export const getDeviceStatusApi = params => request(`/tool/deviceStatus`, {
    method: 'POST',
    body: {
        ...params
    }
});

export const doAuthorizeApi = params => request(`/license/authorize`, {
    method: 'POST',
    body: {
        ...params
    }
});
