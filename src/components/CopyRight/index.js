import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import styles from './index.less';

@connect(({ global }) => ({ version: global.appVersion }))
class CopyRight extends PureComponent {
    componentDidMount() { }

    render() {
        const { version } = this.props;
        return (
            <div className={styles.copyright}><span>{` © ${new Date().getFullYear().toString()} `}教育语音{version ? ` - ${version}` : ''}</span></div>
        )
    }
}

export default CopyRight;
