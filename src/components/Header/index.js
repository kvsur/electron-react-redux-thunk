
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, message } from 'antd';

import styles from './index.less';
import max from '../../assets/max';
import middle from '../../assets/middle';
import history from '../../router-dom/history';
import Bridge from '../../utils/bridge';

// const electron = window.electron;

// const { ipcRenderer } = electron || {};

// import { ipcRenderer } from 'electron';

// const remote = require('electron').remote;

@connect(({global}) => ({
    pageTitle: global.pageTitle,
}))
class Header extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // }
    state = {
        isMax: false,
    };

    componentDidMount() {
        // console.log(this.props);
        history.push('/login');
        // ipcRenderer.on('tray-click', e => {
        //     message.info('客户端已恢复展示');
        // });
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
        const { pageTitle } = this.props;

        return (
            <header className={styles['app-header']}>
                <div className={styles.title}><span className={styles.icon} />教育语音分析系统{pageTitle? `-${pageTitle}` : pageTitle}</div>
                <div className={styles.btns}>
                    <Icon type="minus" onClick={() => {this.toggle('close')}} />
                    <Icon component={isMax ? middle : max} onClick={() => {this.toggle('max')}} />
                    <Icon type="close" onClick={() => {this.toggle('close')}} />
                </div>
            </header>
        )
    }
}

// export default withRouter(connect()(Header));
export default withRouter(Header);
