import React, { Component } from 'react';
import { Form, Button, Select, Input } from 'antd';
import { connect } from 'react-redux';

import history from '../../router-dom/history';
import Layout from '../../components/Layout';

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
class Ending extends Component {
    state = {
        loading: false,
        withinTime: true
    };

    componentDidMount() {

    }

    delay = () => {

    }

    justDoIt = () => {

    }

    submit = e => {
        e.preventDefault();
        history.push('/login');
    };

    render() {
        // const { models, loading } = this.props;
        const { form: { getFieldDecorator }, grade, subject, subjectList } = this.props;
        const { loading, withinTime } = this.state;
        const footer = (
            <div>
                {
                    withinTime ?
                        <Button type="default" onClick={this.justDoIt}>继续上课</Button>
                        :
                        <Button type="default" onClick={this.delay}>延迟5分钟</Button>
                }
                <Button type="primary" onClick={this.submit} loading={loading} style={{ marginLeft: '20px' }}>确认下课</Button>
            </div>
        );
        return (
            <Layout title="下课" footer={footer}>
                <Form {...formItemLayout}>
                    <Item required={false} label="班级">
                        {
                            getFieldDecorator('userAccount', {
                                rules: [{ required: true, message: '未选择班级' }],
                                initialValue: grade,
                            })(
                                // <Input prefix={<Icon type="user" />} placeholder="选择班级" onPressEnter={this.submit} />
                                // <Select placeholder="选择班级" disabled></Select>
                                <Input placeholder="班级" disabled />
                            )
                        }
                    </Item>
                    <Item required={false} label="科目">
                        {
                            getFieldDecorator('password', {
                                rules: [{ required: true, message: '未选择科目' }],
                                initialValue: subject
                            })(
                                <Select placeholder="选择科目" disabled>
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
                    <span>请确认下课，若无操作，录音将在 20 s 后自动关闭。</span>
                </Form>
            </Layout>
        )
    }
}

export default Ending;
