import React, { Component } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

type Props = {
    children: React.ReactNode
};

type State = {};

export default class ProtectedRoute extends Component<Props, State> {
    static contextType = AuthContext
    context!: React.ContextType<typeof AuthContext>;

    render() {
        const { children } = this.props

        if (!this.context?.currentUser) {
            return <Navigate to="/login" replace />;
        }
        return children;
    }
}