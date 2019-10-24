import React, { PureComponent } from 'react';
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import history from '../../router-dom/history';
import { getDeviceStatus } from '../../thunk/global';

import styles from './index.less';

@connect(({global}) => ({
    serviceReady: global.serviceReady
}))
class Loading extends PureComponent {
    timer = null;
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getDeviceStatus(true));
        this.timer = setInterval(() => {
            dispatch(getDeviceStatus(true));
        }, 1000 * 10);
    }

    UNSAFE_componentWillReceiveProps({serviceReady}) {
        if (serviceReady) {
            clearInterval(this.timer);
            history.push('/login');
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render () {
        return (
            <div className={styles.loading}>
                <Spin className={styles.spin} indicator={<Icon type="loading" className={styles.icon} />} tip="服务启动中..." />
            </div>
        );
    }
}

export default Loading;
