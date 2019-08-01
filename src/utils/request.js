import fetch from 'isomorphic-fetch';
import { stringify } from 'qs';
// import { BrowserRouter as Router } from 'react-router-dom';
import { notification } from 'antd';

const BASE_API = 'http://127.0.0.1:1024/teaching';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) return response;
    const errorText = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errorText,
    });
    const error = new Error(errorText);
    error.name = response.status;
    error.response = response;
    throw error;
}

export default function request(url, option) {
    const options = { ...option };
    const defaultOptions = { credentials: 'same-origin' };
    const newUrl = BASE_API + url;
    const newOptions = { ...defaultOptions, ...options };

    const { method } = newOptions;

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                ...newOptions.headers,
            };
            newOptions.body = stringify(newOptions.body);
        } else {
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }

    // let responseTemp = null;

    return fetch(newUrl, newOptions)
        .then(checkStatus)
        .then(response => {
            // responseTemp = response;
            if (response.method === 'DELETE' || response.status === 204) {
                return response.clone().text();
            }
            return response.clone().json();
        })
        .catch( async e => {
            // if (responseTemp && e.message && e.message.indexOf('in JSON at position') >= 0) {
            //     const resultText = await responseTemp.clone().text();
            //     return JSON.parse(`${resultText.split('}{')[0]}}`);
            // }

            const status = e.name;
            if (status === 403) {
                return {
                    message: '服务端禁止当前操作'
                };
            }
            if (status <= 504 && status >= 500) {
                return {
                    message: '服务器内部发生错误'
                };
            }
            if (status >= 404 && status < 422) {
                return {
                    message: '请求错误，请求资源不存在'
                };
            }
            return {
                message: '请求错误'
            };
        })
}
