import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';
// import PropTypes from 'prop-types';

class Header extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // }
    componentDidMount() {
        console.log(this.props);
    }

    go(route) {
        const { history } = this.props;
        if (route) {
            history.push(route);
        } else {
            history.push('/home');
        }
    }


    render() {
        return (
            <div>
                <span onClick={() => { this.go() }}>Header</span>
                <p>
                    <Button onClick={() => { this.go('/user') }}>go user</Button>
                </p>
                <p>
                    <Button onClick={() => { this.go('/department') }}>go depeartment</Button>
                </p>
            </div>
        )
    }
}

export default withRouter(connect()(Header));
