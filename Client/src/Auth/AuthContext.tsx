import React, { Component, createContext } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Box, CircularProgress } from "@mui/material";
import IUserData from "../Utilities/Interfaces/IUserData";
import UserService from '../Services/UserService'

type Props = {
    children: React.ReactNode
};

type State = {
    currentUser: IUserData | null,
    currentFirebaseUser: User | null,
    loading: boolean
};

export const AuthContext = createContext<AuthContextType | null>(null);

export type AuthContextType = {
    currentUser: IUserData | null,
    currentFirebaseUser: User | null,
}

export default class AuthProvider extends Component<Props, State>{
    state: State = { currentUser: null, currentFirebaseUser: null, loading: true }

    componentDidMount() {
        onAuthStateChanged(auth, async (user) => {
            if (user) { 
                const token = await user.getIdToken()
                UserService.addAuthorization(token)
                const currentUser = (await UserService.getByUserUId(user?.uid)).data
                this.setState({
                    currentUser: currentUser,
                    currentFirebaseUser: user,
                    loading: false
                })
            } else {
                // this is when the user is signed out
                this.setState({
                    currentUser: null,
                    currentFirebaseUser: null,
                    loading: false
                })

            }
        })
    }

    render() {
        const { currentUser, currentFirebaseUser, loading } = this.state
        const { children } = this.props

        if (loading) {
            return (
                <Box sx={{ height: "100vh", display: "flex" }} alignItems="center" justifyContent="center">
                    <CircularProgress size={100} thickness={4} />
                </Box>
            )
        }
        return (
            <AuthContext.Provider value={{ currentUser, currentFirebaseUser }}>
                {children}
            </AuthContext.Provider>
        )
    }
};