import React, { Component } from 'react';
import { Form, Button, Input, message, Icon } from 'antd';
import { connect } from 'react-redux';

import history from '../../router-dom/history';
import { login } from '../../thunk/login';
import Layout from '../../components/Layout';

const formItemLayout = {
    labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
    },
    wrapperCol: {
        xs: { span: 48 },
        sm: { span: 24 },
    },
};

const Item = Form.Item;

@Form.create()
@connect()
class Login extends Component {
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

    submit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true,
                });
                const { userAccount, password } = values;
                const { dispatch } = this.props;
                try {
                    await dispatch(login({ userAccount, password }));
                    message.success('登录成功');
                    history.push('/lesson');
                } catch(e) {
                    console.error(e);
                    message.error('登录失败');
                } finally {
                    this.setState({
                        loading: false,
                    });
                }
            }
        });
    };

    render() {
        // const { models, loading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        return (
            <Layout
                title="登录"
                footer={<div><Button type="primary" onClick={this.submit} loading={loading} >登录</Button></div>}
                style={{height: '242px'}}
            >
                <Form {...formItemLayout}>
                    <Item required={false}>
                        {
                            getFieldDecorator('userAccount', {
                                rules: [{ required: true, message: '登录用户名不能为空' }],
                            })(
                                <Input prefix={<Icon type="user" />} placeholder="请输入登录用户名" onPressEnter={this.submit} />
                            )
                        }
                    </Item>
                    <Item required={false}>
                        {
                            getFieldDecorator('password', {
                                rules: [{ required: true, message: '密码不能为空' }],
                            })(
                                <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" onPressEnter={this.submit} />
                            )
                        }
                    </Item>
                </Form>
            </Layout>
        )
    }
}

export default Login;
