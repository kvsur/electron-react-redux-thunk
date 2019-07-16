import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import { Form, Button, Input } from 'antd';
// import { Button } from 'antd';
// import { getSingleModel } from '../../thunk/home';
const formItemLayout = {
    labelCol: {
        xs: { span: 18 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 30 },
        sm: { span: 20 },
    },
};

const Item = Form.Item;

class Home extends Component {
    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'home'
        // })
        // console.log(this.props);
    }

    handleClick = async () => {
        // const { dispatch } = this.props;
        // // console.log(models);
        // const ddd = await dispatch(getSingleModel());
        // console.log(ddd);
    }

    render() {
        // const { models, loading } = this.props;
        return (
            <main className={styles.home}>
                <header className={styles.header}>教育语音分析系统</header>
                <section className={styles.body}>
                    <Form {...formItemLayout}>
                        <Item label="用户名">
                            <Input />
                        </Item>
                        <Item label="密码">
                            <Input />
                        </Item>
                        {/* <Item label="验证码">
                            <Input />
                        </Item> */}
                    </Form>
                </section>
                <footer className={styles.footer}>
                    <Button type="primary">登录</Button>
                </footer>
            </main>
        )
    }
}

export default connect(state => {
    return { ...state.home }
})(Home);
