
/**
 * Created by LeeCH at July 17th, 2019 7:22pm
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, message } from 'antd';

import styles from './index.less';
import Bridge from '../../utils/bridge';

@connect(({global}) => ({
    className: global.classInfo.className,
    deviceStatus: global.deviceStatus,
}))
class Header extends Component {
    componentDidMount() {
        Bridge.on('tray-click', this.handleTrayClick);
        Bridge.on('win-max', this.processToggle);

    }

    componentWillUnmount() {
        Bridge.cancel('tray-click', this.handleTrayClick);
        Bridge.cancel('win-max', this.processToggle);
    }

    handleTrayClick = (data) => {
        console.log(data);
        message.info('客户端已恢复展示');
    }

    processToggle = isMax => {
        this.setState({
            isMax,
        });
    }

    toggle(type) {
        Bridge.send(type);
    };

    render() {
        const { className, deviceStatus } = this.props;

        const classNameNode = <span style={{fontWeight: 'normal'}}>{className ? ` - ${className}` : ''}</span>;
        const deviceStatusNode = <span style={{fontWeight: 'normal'}}>{`(${deviceStatus})`}</span>

        return (
            <header className={styles['app-header']}>
                <div className={styles.title}>智能语音录课助手{deviceStatus ? deviceStatusNode : classNameNode}</div>
                <div className={styles.btns}>
                    <Icon type="close" onClick={() => {this.toggle('close')}} title="关闭窗口" />
                </div>
            </header>
        )
    }
}

export default withRouter(Header);
