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
@connect(({lesson}) => ({
    ...lesson
}))
class Lesson extends Component {
    state = {
        loading: false,
    };

    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'home'
        // })
        // console.log(this.props);
    }

    back = () => {
        history.push('/login');
    }

    submit = e => {
        e.preventDefault();
        history.push('/ending');
    };

    render() {
        // const { models, loading } = this.props;
        const { form: { getFieldDecorator }, grade, subjectList, subject } = this.props;
        const { loading } = this.state;
        const footer = (
            <div>
                <Button type="default" onClick={this.back}>返回</Button>
                <Button type="primary" onClick={this.submit} loading={loading} style={{marginLeft: '20px'}}>开始上课</Button>
            </div>
        );
        return (
            <Layout title="科目选择" footer={footer}>
                <Form {...formItemLayout}>
                    <Item required={false} label="班级">
                        {
                            getFieldDecorator('userAccount', {
                                rules: [{ required: true, message: '未选择班级' }],
                                initialValue: grade,
                            })(
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
                                <Select placeholder="选择班级">
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
                    <span>请选择科目，若无操作，课程记录将在 20 s 后自动开启。</span>
                </Form>
            </Layout>
        )
    }
}

export default Lesson;
