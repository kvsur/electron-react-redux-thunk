import React, { Component } from 'react';
import { Form, Button, Input, message, Icon } from 'antd';
import { connect } from 'react-redux';

import history from '../../router-dom/history';
import Bridge from '../../utils/bridge';
import { login } from '../../thunk/login';
import Layout from '../../components/Layout';
import TYPES from '../../constants/COMMON_ACTION_TYPES';

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

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: TYPES.UPDATE_PAGE_TITLE,
            payload: {
                pageTitle: '登录',
            }
        });
    }

    componentDidMount() {
        Bridge.on('init-class', this.initClass);
    }

    componentWillUnmount() {
        Bridge.cancel('init-class', this.initClass);
    }

    initClass = () => {
        Bridge.send('init-class-response', 1);
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
                let changRoute = 0;
                try {
                    await dispatch(login({ userAccount, password }));
                    message.success('登录成功');
                    changRoute = 1;
                } catch(e) {
                    console.error(e);
                    message.error(e);
                } finally {
                    this.setState({
                        loading: false,
                    }, () => {
                        if (changRoute) history.push('/lesson');
                    });
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        return (
            <Layout
                title="登录"
                footer={<div><Button type="primary" onClick={this.submit} loading={loading} >登录</Button></div>}
                style={{height: '200px'}}
            >
                <Form {...formItemLayout}>
                    <Item required={false}>
                        {
                            getFieldDecorator('userAccount', {
                                rules: [{ required: true, message: '登录名为空' }],
                            })(
                                <Input prefix={<Icon type="user" style={{color: '#fff'}} />} placeholder="请输入登录名" onPressEnter={this.submit} />
                            )
                        }
                    </Item>
                    <Item required={false}>
                        {
                            getFieldDecorator('password', {
                                rules: [{ required: true, message: '密码为空' }],
                            })(
                                <Input prefix={<Icon type="lock"  style={{color: '#fff'}} />} type="password" placeholder="请输入密码" onPressEnter={this.submit} />
                            )
                        }
                    </Item>
                </Form>
            </Layout>
        )
    }
}

export default Login;
