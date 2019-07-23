export const BASE_API = process.env.NODE_ENV === 'production' ? 'http://localhost:1024/api' : 'http://localhost:1024/api';

// 用户无操作自动执行动作的时间，单位为（s）秒
export const NO_OPRATION_TIME = 20; 

const TYPES =  {
    // home actions 
    CHANGE_MODEL_LIST_LOADING: Symbol(),
    UPDATE_MODEL_LIST: Symbol(),

    // login acitons 
    

    // user actions 

    // department actions 
    
    // lesson actions 
    UPDATE_SUBJECT_LIST: Symbol(),
    UPDATE_SCHEDULE: Symbol(),
    UPDATE_SUBJECT_ID: Symbol(),
};
export default TYPES;