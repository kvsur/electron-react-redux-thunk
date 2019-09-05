const Express = require('express');

const router = new Express.Router();

router.post('/user/login', (req, res) => {
    const { userAccount, password } = req.body;
    console.log({ userAccount, password });

    res.json({
        "code": 0,
        "message": "请求成功",
        "data":
        {
            name: "张瑜浩",
            subjectList: [
                {
                    subjectId: 'f79asd8f79as8df',
                    subjectName: '数学'
                },
                {
                    subjectId: 'f79a8sdg687h6g',
                    subjectName: '英语'
                },
                {
                    subjectId: '9hnfba8vf68sdf7t',
                    subjectName: '语文'
                },
                {
                    subjectId: 'fs7f87s8g68sdf5ga',
                    subjectName: '历史'
                },
                {
                    subjectId: '烦a7s6df456asg0000aa',
                    subjectName: '政治'
                },
                {
                    subjectId: 'fuosidufaisudyfdffsdf6',
                    subjectName: '化学'
                },
                {
                    subjectId: 'fasdf8a7s8g76a8s7f__',
                    subjectName: '物理'
                },
            ],
        }
    });
});

router.post('/class/getInfo', (req, res) => {
    res.json({
        "code": 0,
        "message": "请求成功",
        "data":{
            "classId":"cvodsglkoert",  //当前教室的编号
            "className":"四（1）班",  //当前教室的名称
            "schoolId":"zjhz-xuejunxiaoxue",  //当前教室所在的学校编号
            "deviceId":"134519998"  //当前教室所在的电脑对应的设备号
        }
    });
});

router.post('/class/getClassSchedule', (req, res) => {
    res.json({
        "code": 0,
        "message": "请求成功",
        "data":
            [
                {
                    "scheduleTimeId": "1",
                    "classStartTime": "10:30",
                    "classEndTime": "11:10"
                },
                {
                    "scheduleTimeId": "2",
                    "classStartTime": "11:20",
                    "classEndTime": "12:00"
                },
                {
                    "scheduleTimeId": "3",
                    "classStartTime": "18:24",
                    "classEndTime": "18:56"
                }
            ]
    });
});

router.post('/class/classStart', (req, res) => {
    const { time, subjectId } = req.body;
    console.log({ time, subjectId });
    res.json({
        "code": 0,
        "message": "请求成功",
        data: null
    });
});

router.post('/class/classEnd', (req, res) => {
    const { time, subjectId } = req.body;
    console.log({ time, subjectId });
    res.json({
        "code": 0,
        "message": "请求成功",
        data: null
    });
});

module.exports = router;
