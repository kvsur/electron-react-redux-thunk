import React, { Component } from 'react';
// import { connect } from 'react-redux';
import Bridge from '../../utils/bridge';
import { Modal, Progress, message } from 'antd';
// import TYPES from '../../constants/COMMON_ACTION_TYPES';

// @connect()
class Updater extends Component {
  state = {
    showModal: false,
    updateText: '正在下载更新......',
    percent: 0,
    isAva: false,
  };

  componentWillMount() {
    Bridge.on('update-start', this.checkUpateStart);
    Bridge.on('update-message', this.showUpdateMessage);
    Bridge.on('download-progress', this.dealProgress);
    Bridge.on('update-now', this.updateNow);
    Bridge.on('update-close', this.updateClose);
    Bridge.on('update-available', this.updateAvailable);
    Bridge.on('service-tip', this.serviceTip);
    Bridge.on('service-log', this.serviceLog);
    Bridge.on('version-info', this.showVersionInfo);
  }

  componentDidMount() {
    Bridge.send('check-update');
  }

  componentWillUnmount() {
    Bridge.cancel('update-start', this.checkUpateStart);
    Bridge.cancel('update-message', this.showUpdateMessage);
    Bridge.cancel('download-progress', this.dealProgress);
    Bridge.cancel('update-now', this.updateNow);
    Bridge.cancel('update-close', this.updateClose);
    Bridge.cancel('update-available', this.updateAvailable);
    Bridge.cancel('service-tip', this.serviceTip);
    Bridge.cancel('service-log', this.serviceLog);
    Bridge.cancel('version-info', this.showVersionInfo);
  }

  showVersionInfo = ({appVersion}) => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: TYPES.UPDATE_APP_VERSION,
    //   payload: {
    //     appVersion
    //   }
    // });
    Modal.info({
      title: '版本信息',
      width: 235,
      content: (
        <span>教育语音-{appVersion}</span>
      ),
      okText: '关闭',
      onOk: () => {},
      okButtonProps: {
        size: 'small',
        type: 'default'
      }
    });
  }

  serviceTip = ({message:msg, type}) => {
    message[type](msg);
    console.log(msg);
  }

  serviceLog = log => {
    console.log(log);
  }

  checkUpateStart = () => {
    this.setState({
      showModal: true,
    });
  }

  updateAvailable = () => {
    this.setState({
      isAva: true,
    });
  }

  updateClose = error => {
    console.log(error);
    setTimeout(() => {
      this.setState({
        showModal: false,
      });
    }, 2000);
  }

  updateNow = () => {
    Bridge.send('update-now');
    this.setState({
      showModal: false,
    });
  }

  showUpdateMessage = updateText => {
    // message.warning(msg);
    this.setState({
      updateText,
    });
  }

  dealProgress = progressObj => {
    // const { transferred, total, bytesPerSecond, } = progressObj;
    console.log(...progressObj);
    let { percent } = progressObj;
    percent = Math.floor(percent * 100) / 100;

    this.setState({
      percent,
    });
  }

  render() {
    const { showModal, updateText, percent, isAva } = this.state;
    return (
        <Modal
        visible={showModal}
        title={null}
        width={200}
        footer={null}
        closable={false}
        keyboard={false}
        maskClosable={false}
        centered
        >
        <span style={{ color: '#fb7b1c' }}>{updateText}</span>
        {
            isAva ? 
            <Progress
            strokeColor={{
                '0%': '#f3bbbb',
                '100%': '#87d068',
            }}
            percent={percent}
            size="small"
            /> : null
        }
        </Modal>
    );
  }
}

export default Updater;
