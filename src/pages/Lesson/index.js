import React, { Component } from 'react';
import { Form, Button, Select, Input, message } from 'antd';
import { connect } from 'react-redux';

import history from '../../router-dom/history';
import Layout from '../../components/Layout';
import TYPES, { NO_OPRATION_TIME } from '../../constants/COMMON_ACTION_TYPES';
import Bridge from '../../utils/bridge';
import { startClass } from '../../thunk/lesson';

// const electron = window.electron;

// const { ipcRenderer } = electron || {};

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
@connect(({ lesson }) => ({
    ...lesson
}))
class Lesson extends Component {
    timer = null;

    state = {
        loading: false,
        time: NO_OPRATION_TIME,
    };

    componentWillMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'home'
        // })
        // console.log(this.props);
    }

    componentDidMount() {
        // 规定时间后无任何操作则自动进行开始上课的操作
        this.timer = setInterval(() => {
            const { time } = this.state;
            if (time === 0) {
                this.submit({preventDefault: () => {}});
            } else {
                this.setState({
                    time: time - 1
                });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }


    back = () => {
        clearInterval(this.timer);
        history.push('/login');
    }

    submit = e => {
        clearInterval(this.timer);
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                const { subjectId } = values;
                dispatch({
                    type: TYPES.UPDATE_SUBJECT_ID,
                    payload: {
                        subjectId
                    },
                });
                this.setState({
                    loading: true,
                });
                // if (ipcRenderer) {
                //     ipcRenderer.send('close');
                // }
                let changeRoute = 0;
                try {
                    const time = new Date().getTime();

                    await dispatch(startClass({time, subjectId}));
                    
                    Bridge.send('class-start', 0.5);
                    changeRoute = 1;
                } catch (e) {
                    message.error(e);
                } finally {
                    this.setState({
                        loading: false,
                    }, () => {
                        if (changeRoute) history.push('/ending');
                    });
                }
            }
        });
    };

    render() {
        // const { models, loading } = this.props;
        const { form: { getFieldDecorator }, className, subjectList, subjectId } = this.props;
        const { loading, time } = this.state;
        const footer = (
            <div>
                <Button type="default" onClick={this.back}>返回</Button>
                <Button type="primary" onClick={this.submit} loading={loading} style={{ marginLeft: '20px' }}>开始上课</Button>
            </div>
        );
        return (
            <Layout title="科目选择" footer={footer}>
                <Form {...formItemLayout}>
                    <Item required={false} label="班级">
                        {
                            getFieldDecorator('className', {
                                rules: [{ required: true, message: '未选择班级' }],
                                initialValue: className,
                            })(
                                <Input placeholder="班级" disabled />
                            )
                        }
                    </Item>
                    <Item required={false} label="科目">
                        {
                            getFieldDecorator('subjectId', {
                                rules: [{ required: true, message: '未选择科目' }],
                                initialValue: subjectId
                            })(
                                <Select placeholder="选择科目">
                                    {
                                        subjectList.map(item => {
                                            const { id, subjectName } = item;
                                            return (
                                                <Select.Option key={id} value={id} >{subjectName}</Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <span>请选择科目，若无操作，课程记录将在{`${time}`}s 后自动开启。</span>
                </Form>
            </Layout>
        )
    }
}

export default Lesson;
