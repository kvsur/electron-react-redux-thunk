import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import { Form, Button, Input, message, Icon } from 'antd';
// import { Button } from 'antd';
// import { getSingleModel } from '../../thunk/home';
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
    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'home'
        // })
        // console.log(this.props);
    }

    submit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
              message.success('认证成功');
          }
        });
      };

    render() {
        // const { models, loading } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <main className={styles.login}>
                <header className={styles.header}>教育语音分析系统</header>
                <section className={styles.body}>
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
                </section>
                <footer className={styles.footer}>
                    <Button type="primary" onClick={this.submit}>登录</Button>
                </footer>
            </main>
        )
    }
}

export default Login;
