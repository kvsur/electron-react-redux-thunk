import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { getSingleModel } from '../../thunk/home';


class Home extends Component {
    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'home'
        // })
    }

    handleClick = async () => {
        const { dispatch, models } = this.props;
        console.log(models);
        dispatch(getSingleModel())
    }

    render() {
        const { models, loading } = this.props;
        return (
            <div>
                {
                    models.map(model => model.key).join('-')
                }
                <Button loading={loading} onClick={this.handleClick}>home</Button>
            </div>
        )
    }
}

export default connect(state => {
    return { ...state.home }
})(Home);
