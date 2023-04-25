import React, { Component } from 'react'
import NavBar from './NavBar'

export default class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <NavBar/>
                <div>Home</div>
            </React.Fragment>
        )
    }
}
