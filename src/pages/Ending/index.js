import React, { Component } from 'react';
import { Form, Button, Select, Input, message } from 'antd';
import { connect } from 'react-redux';

import history from '../../router-dom/history';
import Layout from '../../components/Layout';
import Timer from '../../components/Timer';
import Bridge from '../../utils/bridge';
import { NO_OPRATION_TIME } from '../../constants/COMMON_ACTION_TYPES';
import { endClass } from '../../thunk/lesson';

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 40 },
        sm: { span: 20 },
    },
};

const Item = Form.Item;

@Form.create()
@connect(({ lesson, global }) => ({
    ...lesson,
    classInfo: global.classInfo,
}))
class Ending extends Component {
    timer = null;

    canSubmit = true;

    state = {
        loading: false,
        withinTime: true,
        time: NO_OPRATION_TIME,
        showDelay: true,
    };

    componentWillMount() {
        Bridge.send('resize', 485);
        // const { dispatch } = this.props;
        // dispatch({
        //     type: TYPES.UPDATE_PAGE_TITLE,
        //     payload: {
        //         pageTitle: '下课',
        //     }
        // });
    }

    componentDidMount() {
        Bridge.on('init-class', this.initClass);
        Bridge.on('class-will-end', this.handleClassEnd);
    }

    componentWillUnmount() {
        Bridge.cancel('init-class', this.initClass);
        Bridge.cancel('class-will-end', this.handleClassEnd);
    }

    initClass = () => {
        Bridge.send('init-class-response', 0);
    }

    handleClassEnd = () => {
        Bridge.send('resize', 511);
        this.setState({
            withinTime: false,
        });
        this.timer = setInterval(() => {
            if (!this.canSubmit) {
                clearInterval(this.timer);
                return;
            }
            const { time } = this.state;
            if (time === 0) {
                clearInterval(this.timer);
                this.submit({preventDefault: () => {}});
            } else {
                this.setState({
                    time: time - 1
                });
            }
        }, 1000);
    }

    classEnd = (timeout) => {
        Bridge.send('class-end', timeout);
    }

    delay = () => {
        clearInterval(this.timer);
        Bridge.send('resize', 485);
        this.setState({
            withinTime: true,
            showDelay: false,
        });
        Bridge.send('class-delay', (5 * 60 * 1000));
    }

    justDoIt = () => {
        Bridge.send('close');
    }

    getNextSchedule = (now, schedules) => {
        const [...tempSchedules] = schedules;
        if (now && tempSchedules && tempSchedules.length) {
            const nextSchedule = tempSchedules.shift();
            const { milliesStartTime } = nextSchedule;
            if (now < milliesStartTime) return nextSchedule;
            return this.getNextSchedule(now, tempSchedules);
        }
        return null;
    }

    submit = async e => {
        clearInterval(this.timer);
        e.preventDefault();
        this.setState({
            loading: true,
        });
        let changeRoute = 0;
        try {
            const { dispatch, subjectId, userAccount, schedule, currentSchedule } = this.props;
            const time = new Date().getTime();

            const nextSchedule = this.getNextSchedule(time, schedule);

            console.log('----------------------下课日志输出----------------------');
            
            if (nextSchedule) {
                const { milliesStartTime } = nextSchedule;
                this.classEnd(time - milliesStartTime);
                console.log('下一节课上课时间:', new Date(milliesStartTime).toLocaleString('zh-CN', {hour12: false}));
            } else {
                console.log('*****************接下来没有上课作息表*****************');
            }
        
            const { scheduleTimeId, milliesStartTime, milliesEndTime } = currentSchedule;
            await dispatch(endClass({time, subjectId, userAccount, scheduleTimeId}));
            this.canSubmit = false; // Can not submit after end class success
            console.log('下课实际时间：', new Date(time).toLocaleString('zh-CN', {hour12: false}));
            console.log('上课对应作息表时间', new Date(milliesStartTime).toLocaleString('zh-CN', {hour12: false}));
            console.log('下课对应作息表时间', new Date(milliesEndTime).toLocaleString('zh-CN', {hour12: false}));
            console.log('作息表对应ID：', scheduleTimeId);
            changeRoute = 1;
        } catch (e) {
            message.error(e.message || e);
        } finally {
            this.setState({
                loading: false,
            }, () => {
                if (changeRoute) history.push('/login');
            });
        }
    };

    render() {
        // const { models, loading } = this.props;
        const { form: { getFieldDecorator }, classInfo: { className }, subjectId, subjectList } = this.props;
        const { loading, withinTime, time, showDelay } = this.state;

        // const delay = showDelay ? <Button type="default" onClick={this.delay}>延迟5分钟</Button> : null;
        const delay = showDelay ? <span style={{cursor: 'pointer', color: 'rgba(24, 118, 255, 1)'}} onClick={this.delay}>延迟5分钟</span> : null;
        
        const footer = (
            <div>
                {
                    withinTime ?
                        // <Button type="default" onClick={this.justDoIt}>继续上课</Button>
                        <span style={{cursor: 'pointer', color: 'rgba(24, 118, 255, 1)'}} onClick={this.justDoIt}>继续上课</span>
                        :
                        delay
                }
                <Button className="ant-btn-green" onClick={this.submit} loading={loading}>确认下课</Button>
            </div>
        );
        return (
            <Layout title="下课" footer={footer} needPing>
                <Form {...formItemLayout}>
                    <Timer />
                    <Item required={false}>
                        {
                            getFieldDecorator('userAccount', {
                                rules: [{ required: true, message: '未选择班级' }],
                                initialValue: className,
                            })(
                                <Input placeholder="班级" disabled />
                            )
                        }
                    </Item>
                    <Item required={false}>
                        {
                            getFieldDecorator('password', {
                                rules: [{ required: true, message: '未选择科目' }],
                                initialValue: subjectId
                            })(
                                <Select placeholder="选择科目" disabled>
                                    {
                                        subjectList.map(item => {
                                            const { subjectId, subjectName } = item;
                                            return (
                                                <Select.Option key={subjectId} value={subjectId} >{subjectName}</Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    {
                        !withinTime ? <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>请确认下课,若无操作,课程将在{time}s后结束</span> : null
                    }
                </Form>
            </Layout>
        )
    }
}

export default Ending;
