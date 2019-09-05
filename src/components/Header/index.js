
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, message } from 'antd';

import styles from './index.less';
import max from '../../assets/max';
import middle from '../../assets/middle';
// import history from '../../router-dom/history';
import Bridge from '../../utils/bridge';

@connect(({global}) => ({
    pageTitle: global.pageTitle,
    version: global.appVersion,
}))
class Header extends Component {
    state = {
        isMax: false,
    };

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
        const { isMax } = this.state;
        const { version } = this.props;

        return (
            <header className={styles['app-header']}>
                <div className={styles.title}>教育语音{version ? `-${version}` : ''}</div>
                <div className={styles.btns}>
                    <Icon type="minus" onClick={() => {this.toggle('close')}} title="最小化窗口" />
                    <Icon component={isMax ? middle : max} onClick={() => {this.toggle('max')}} title={isMax ? '' : '最大化窗口'} />
                    <Icon type="close" onClick={() => {this.toggle('close')}} title="关闭窗口" />
                </div>
            </header>
        )
    }
}

export default withRouter(Header);
