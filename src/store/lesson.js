export default {
    userAccount: '', // 用户登录账号
    className: '', // 班级名称
    userName: '', // 登录用户名
    subjectId: '', // subjectId 开始上课时所选科目
    classId: '', // 班级对应的id
    schoolId: '', // 学校的id
    deviceId: '', // 班级对应设备的id
    subjectList: [],
    // 今日份的作息表
    // new Date().toLocaleString('zh-CN', {hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'})
    schedule: [],
    currentSchedule: null,
};
