const Express = require('express');

const router = new Express.Router();

router.post('/login', (req, res) => {
    const { userAccount, password } = req.body;
    console.log({ userAccount, password });

    res.json({
        "code": 'A0001',
        "message": "请求成功",
        "data":
        {
            className: "四（一）班",
            subjectList: [
                {
                    id: 'f79asd8f79as8df',
                    subjectName: '数学'
                },
                {
                    id: 'f79a8sdg687h6g',
                    subjectName: '英语'
                },
                {
                    id: '9hnfba8vf68sdf7t',
                    subjectName: '语文'
                },
                {
                    id: 'fs7f87s8g68sdf5ga',
                    subjectName: '历史'
                },
                {
                    id: '烦a7s6df456asg0000aa',
                    subjectName: '政治'
                },
                {
                    id: 'fuosidufaisudyfdffsdf6',
                    subjectName: '化学'
                },
                {
                    id: 'fasdf8a7s8g76a8s7f__',
                    subjectName: '物理'
                },
            ],
        }
    });
});

router.post('/getClassSchedule', (req, res) => {
    res.json({
        "code": 'A0001',
        "message": "请求成功",
        "data":
            [
                {
                    "studyRestBeginTime": "10:30",
                    "studyRestEndTime": "11:10"
                },
                {
                    "studyRestBeginTime": "11:20",
                    "studyRestEndTime": "12:00"
                },
                {
                    "studyRestBeginTime": "13:30",
                    "studyRestEndTime": "14:10"
                }
            ]
    });
});

router.post('/classStart', (req, res) => {
    res.json({
        "code": 'A0001',
        "message": "请求成功",
        data: null
    });
});

router.post('/classEnd', (req, res) => {
    res.json({
        "code": 'A0001',
        "message": "请求成功",
        data: null
    });
});

module.exports = router;
