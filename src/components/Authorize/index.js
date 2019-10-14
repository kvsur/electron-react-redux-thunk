import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, message } from 'antd';

import { doAuthorize, getClassInfo } from '../../thunk/global';
import Bridge from '../../utils/bridge';

const { Item } = Form;

@Form.create()
@connect(({global}) => ({
    licenseId: global.classInfo.licenseId,
    deviceName: global.classInfo.deviceName,
}))
class Authorize extends Component {
    state = {
        visible: false,
        loading: false,
    };

    componentDidMount() {
        Bridge.on('do-authorize', this.doAuthorize);
        // setTimeout(this.doAuthorize, 1000)
    }

    componentWillUnmount() {
        Bridge.cancel('do-authorize', this.doAuthorize);
    }

    doAuthorize = () => {
        this.setState({
            visible: true,
        });
    }

    doCancel = () => {
        const { form: { resetFields } } = this.props;
        resetFields();
        this.setState({
            visible: false,
        });

    }

    submit = () => {
        const { form: { validateFields }, dispatch } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true,
                });

                const code = await dispatch(doAuthorize({...values}));

                if (code === 0) {
                    this.setState({
                        visible: false,
                    });
                    dispatch(getClassInfo());
                    message.success('授权成功');
                } else {
                    message.error('授权失败');
                }
                this.setState({
                    loading: false,
                });
            }
        });
    }

    render() {
        const { visible, loading } = this.state;
        const { form: { getFieldDecorator }, licenseId, deviceName } = this.props;
        return (
            <section style={{display: 'none'}}>
                <Modal
                    style={{top: '10px'}}
                    bodyStyle={{padding: '15px'}}
                    title={<span style={{fontSize: '14px'}}>设备授权</span>}
                    destroyOnClose
                    maskClosable={false}
                    visible={visible}
                    onOk={this.submit}
                    onCancel={this.doCancel}
                    okText="授权"
                    cancelText="取消"
                    confirmLoading={loading}
                    cancelButtonProps={{size: 'small'}}
                    okButtonProps={{size: 'small'}}
                >
                    <Form>
                        <Item>
                            {
                                getFieldDecorator('deviceName', {
                                    initialValue: deviceName,
                                    rules: [{
                                        required: true,
                                        message: '设备名称不能为空'
                                    },{
                                        pattern: /^[^\s]{1,20}$/,
                                        message: '设备名称格式有误'
                                    }]
                                })(
                                    <Input maxLength={20} placeholder="请输入设备名称" />
                                )
                            }
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('licenseId', {
                                    initialValue: licenseId,
                                    rules: [{
                                        required: true,
                                        message: '授权码不能为空'
                                    },{
                                        pattern: /^\w{1,100}$/,
                                        message: '授权码格式有误',
                                    }]
                                })(
                                    <Input maxLength={100} placeholder="请输入授权码" />
                                )
                            }
                        </Item>
                    </Form>
                </Modal>
            </section>
        );
    }
}

export default Authorize;
