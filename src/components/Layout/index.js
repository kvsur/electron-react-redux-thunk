/**
 * Created by LeeCH at July 19th, 2019 5:32pm
 */
import React from 'react';
import styles from './index.less';

export default ({title, footer, style={}, children}) => (
    <main className={styles.layout} style={style}>
        {/* <header className={styles.header}>{title}</header> */}
        <section className={styles.body}>
            {children}
        </section>
        <footer className={styles.footer}>
            {footer}
        </footer>
    </main>
);
