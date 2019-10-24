/**
 * Created by LeeCH at July 19th, 2019 5:32pm
 */
import React from 'react';
import Ping from '../Ping';
import styles from './index.less';

export default ({title, footer, style={}, children, needPing=false}) => (
    <main className={styles.layout} style={style}>
        {/* <header className={styles.header}>{title}</header> */}
        {
            needPing ? <Ping /> : null
        }
        <section className={styles.body}>
            {children}
        </section>
        <footer className={styles.footer}>
            {footer}
        </footer>
    </main>
);
