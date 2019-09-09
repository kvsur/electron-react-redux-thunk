/**
 * Created by LeeCH at July 31st, 2019 1:45pm
 */
import React, { Component } from 'react';
import Bridge from '../../utils/bridge';
import { Modal, Progress, message } from 'antd';
import history from '../../router-dom/history';

// @connect()
class Updater extends Component {
  state = {
    showModal: false,
    updateText: '正在下载更新......',
    percent: 0,
    isAva: false,
  };

  componentWillMount() {
    
  }

  componentDidMount() {
    Bridge.on('download-progress', this.dealProgress);
    Bridge.on('update-downloaded-choose', this.updateNow);
    Bridge.on('update-close', this.updateClose);
    Bridge.on('update-not-available', this.noNewVersion);
    Bridge.on('update-available-choose', this.updateAvailable);
    Bridge.on('service-tip', this.serviceTip);
    Bridge.on('service-log', this.serviceLog);
    Bridge.on('version-info', this.showVersionInfo);
    Bridge.on('boot-choose', this.bootChoose);
    Bridge.send('check-update');
    history.push('/login');
  }

  componentWillUnmount() {
    Bridge.cancel('download-progress', this.dealProgress);
    Bridge.cancel('update-downloaded-choose', this.updateNow);
    Bridge.cancel('update-close', this.updateClose);
    Bridge.cancel('update-not-available', this.noNewVersion);
    Bridge.cancel('update-available-choose', this.updateAvailable);
    Bridge.cancel('service-tip', this.serviceTip);
    Bridge.cancel('service-log', this.serviceLog);
    Bridge.cancel('version-info', this.showVersionInfo);
    Bridge.cancel('boot-choose', this.bootChoose);
  }

  bootChoose = () => {
    Modal.confirm({
      title: '操作提示',
      width: 265,
      content: (
        <span>当前已经是自启动模式，是否关闭自启动？</span>
      ),
      okText: '关闭',
      onOk: () => {
        Bridge.send('boot-choose-res', 1);
      },
      okButtonProps: {
        size: 'small',
        type: 'danger',
      },
      cancelText: '保留',
      onCancel: () => { },
      cancelButtonProps: {
        size: 'small',
        type: 'default'
      }
    });
  }

  showVersionInfo = ({ appVersion }) => {
    Modal.info({
      title: '版本信息',
      width: 235,
      content: (
        <span>教育语音-{appVersion}</span>
      ),
      okText: '关闭',
      onOk: () => {

      },
      okButtonProps: {
        size: 'small',
        type: 'default'
      }
    });
  }

  serviceTip = ({ message: msg, type }) => {
    message[type](msg);
    console.log(msg);
  }

  serviceLog = log => {
    console.warn('service-log-output-warning', log);
  }

  updateAvailable = ({ version }) => {
    Modal.confirm({
      title: '更新提示',
      width: 265,
      content: (
        <span>有新的版本{version}可更新，是否需要更新？</span>
      ),
      okText: '更新',
      onOk: () => {
        this.setState({
          showModal: true,
        });
        Bridge.send('download-update');
      },
      okButtonProps: {
        size: 'small',
        type: 'default'
      },
      cancelText: '不更新',
      onCancel: () => { },
      cancelButtonProps: {
        size: 'small',
        type: 'default'
      }
    });
  }

  noNewVersion = ({ version }) => {
    Modal.info({
      title: '更新提示',
      width: 235,
      content: (
        <span>当前无版本更新，{version}为最新版本</span>
      ),
      okText: '关闭',
      onOk: () => { },
      okButtonProps: {
        size: 'small',
        type: 'default'
      }
    });
  }

  updateClose = error => {
    this.setState({
      showModal: false,
    }, () => {
      message.error('检测更新出错，请您稍后尝试。');
    });
  }

  updateNow = () => {
    this.setState({
      showModal: false,
    }, () => {
      Modal.confirm({
        title: '安装提示',
        width: 265,
        content: (
          <span>更新已下载完成，是否立即安装？</span>
        ),
        okText: '安装',
        onOk: () => {
          Bridge.send('install-now');
        },
        okButtonProps: {
          size: 'small',
          type: 'default'
        },
        cancelText: '取消',
        onCancel: () => { },
        cancelButtonProps: {
          size: 'small',
          type: 'default'
        }
      });
    });
  }

  showUpdateMessage = updateText => {
    this.setState({
      updateText,
    });
  }

  dealProgress = ({ percent }) => {
    this.setState({
      percent,
    });
  }

  render() {
    const { showModal, percent } = this.state;
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
        <span style={{ color: '#fb7b1c' }}>正在下载更新...</span>
        <Progress
          strokeColor={{
            '0%': '#f3bbbb',
            '100%': '#87d068',
          }}
          percent={+(percent.toFixed(2))}
          size="small"
        />
      </Modal>
    );
  }
}

export default Updater;
