import React, { PureComponent } from 'react';

import styles from './index.less';

class Timer extends PureComponent {
    timer = null;
    state = {
        timeStr: '00:00:00',
        time: 0,
    };

    componentDidMount() {
        this.timer = setInterval(this.updateTime, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateTime = () => {
        const { time } = this.state;
        this.setState({
            time: time + 1
        });
    }

    calc(time) {
        let second = Math.floor(time % 60).toString();
        second = second.length > 1 ? second : `0${second}`;
        let minute = Math.floor((time % 3600) / 60).toString();
        minute = minute.length > 1 ? minute : `0${minute}`;
        let hour = Math.floor(time / 3600).toString();
        hour = hour.length > 1 ? hour : `0${hour}`;
        return `${hour}:${minute}:${second}`;
    }

    render() {
        const { recording = true } = this.props;
        const { time } = this.state;
        return (
            <section className={styles.timer}>
                <p className={styles.time}>{this.calc(time)}</p>
                {
                    recording ? <p>录音中</p> : <p className={styles.error}>未录音</p>
                }
            </section>
        )
    }
}

export default Timer;
