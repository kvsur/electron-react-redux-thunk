import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { notification, Icon } from 'antd';
import { doPing } from '../../thunk/global';

const config = {
    top: 50,
    placement: 'topRight',
    duration: null,
    btn: null,
    message: <Icon type="bell" style={{ color: 'rgba(255, 91, 82, 1)' }} />,
    key: 'GLOBAL_ERROR_MESSAGE_SHOW_BOX',
};

@connect()
class Ping extends PureComponent {
    timer = null;

    errorShowing = false;

    componentDidMount() {
        this.doPing();
        this.timer = setInterval(this.doPing, 1000 * 10);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    doPing = async () => {
        const { dispatch } = this.props;
        try {
            let res = await dispatch(doPing());
            res = res || {};

            if (res.code === 0) {
                if (this.errorShowing) {
                    this.errorShowing = false;
                    notification.open({
                        ...config,
                        duration: 0.1,
                        description: <span style={{ color: 'rgba(255, 91, 82, 1)' }}></span>,
                    });
                }
            } else {
                this.errorShowing = true;
                notification.open({
                    ...config,
                    onClose: () => {this.errorShowing = false},
                    description: <span style={{ color: 'rgba(255, 91, 82, 1)' }}>{res.message}</span>,
                });
            }
        } catch (e) {
            // Do not need anything 
        }
    }

    render() {
        return (
            <div style={{display: 'none'}} />
        )
    }
}

export default Ping;
