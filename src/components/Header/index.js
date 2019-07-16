
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Button } from 'antd';
import styles from './index.less';
import { Icon } from 'antd';
import max from '@/assets/max';
import middle from '@/assets/middle';

import history from '@/router-dom/history';

const electron = window.electron;

const { ipcRenderer } = electron;

// import { ipcRenderer } from 'electron';

// const remote = require('electron').remote;

class Header extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // }
    state = {
        isMax: false,
    };

    componentDidMount() {
        // console.log(this.props);
        history.push('/home');
    }

    toggle(type) {
        ipcRenderer.send(type);

        if (type === 'max') {
            const { isMax } = this.state;

            this.setState({
                isMax: !isMax,
            });
        }
        // remote.getCurrentWindow().maximize();
    };

    render() {
        const { isMax } = this.state;

        return (
            <header className={styles['app-header']}>
                <div className={styles.title}>教育语音分析系统</div>
                <div className={styles.btns}>
                    <Icon type="minus" onClick={() => {this.toggle('minus')}} />
                    <Icon component={isMax ? middle : max} onClick={() => {this.toggle('max')}} />
                    <Icon type="close" onClick={() => {this.toggle('close')}} />
                </div>
            </header>
        )
    }
}

export default withRouter(connect()(Header));
