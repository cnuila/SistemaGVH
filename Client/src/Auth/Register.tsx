import React, { Component, SyntheticEvent } from 'react'
import { Alert, Avatar, Box, Button, Container, Link, Snackbar, TextField, Typography } from '@mui/material'
import { Person } from '@mui/icons-material'
import { Navigate } from 'react-router-dom'
import UserService from '../Services/UserService'
import IUserData from '../Utilities/Interfaces/IUserData'

type Props = {}

type State = {
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    showError: boolean,
    errorMessage: string,
    userCreated: boolean,
}

export default class Register extends Component<Props, State> {
    state: State = {
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        showError: false,
        errorMessage: "",
        userCreated: false,
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "email") {
            this.setState({ email: value })
        }
        if (name === "password") {
            this.setState({ password: value })
        }
        if (name === "confirmPassword") {
            this.setState({ confirmPassword: value })
        }
        if (name === "firstName") {
            this.setState({ firstName: value })
        }
        if (name === "lastName") {
            this.setState({ lastName: value })
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { email, password, firstName, lastName } = this.state
                const userToAdd: IUserData = {
                    id: null,
                    userName: email,
                    firstName,
                    lastName,
                    password,
                    isAdmin: null,
                    userUId: null
                }
                
                UserService.addUser(userToAdd).then((response: any) => {
                    this.setState({
                        userCreated: true
                    })
                })

            } catch (error) {
                this.prepareErrorMessage("Error desconocido, intenta luego.")
            }
        }
    }

    validations = () => {
        const { email, password, confirmPassword, firstName, lastName } = this.state
        if (email === "") {
            this.prepareErrorMessage("Debes ingresar un correo electrónico");
            return false
        }
        if (password === "") {
            this.prepareErrorMessage("Debes ingresar una contraseña");
            return false
        }

        if (password !== confirmPassword) {
            this.prepareErrorMessage("Ambas contraseñas deben ser iguales");
            return false
        }

        if (firstName === "") {
            this.prepareErrorMessage("Debes ingresar un nombre");
            return false
        }

        if (lastName === "") {
            this.prepareErrorMessage("Debes ingresar un apellido");
            return false
        }
        return true
    }

    prepareErrorMessage = (message: string) => {
        this.setState({
            showError: true,
            errorMessage: message
        });
    }

    handleOnErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            showError: false,
            errorMessage: ""
        });
    };

    render() {
        const { email, password, confirmPassword, firstName, lastName, showError, errorMessage, userCreated } = this.state

        return (
            userCreated ? <Navigate to={"/login"} replace /> :
                <Box sx={{ bgcolor: "#002366", height: "100vh", display: "flex" }}>

                    <Snackbar open={showError} autoHideDuration={5000} onClose={this.handleOnErrorClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                        <Alert onClose={this.handleOnErrorClose} severity="error" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    </Snackbar>

                    <Container maxWidth="sm" sx={{ m: "auto" }}>
                        <Box
                            sx={{
                                bgcolor: "white", display: "flex", flexDirection: "column", alignItems: "center",
                                borderRadius: "8px", px: 4, py: 2
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: "#002366" }}>
                                <Person />
                            </Avatar>
                            <Typography variant="h5">Crear Usuario</Typography>

                            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={this.handleOnSubmit}>
                                <TextField id="email" variant="outlined" margin="normal" required fullWidth type="email"
                                    label="Correo Electrónico" name="email" value={email} onChange={this.handleOnChange}
                                />

                                <TextField id="password" variant="outlined" margin="normal" required fullWidth type="password"
                                    label="Contraseña" name="password" value={password} onChange={this.handleOnChange} />

                                <TextField id="confirmPassword" variant="outlined" margin="normal" required fullWidth type="password"
                                    label="Confirmar Contraseña" name="confirmPassword" value={confirmPassword} onChange={this.handleOnChange} />

                                <TextField id="firstName" variant="outlined" margin="normal" required fullWidth type="text"
                                    label="Nombre" name="firstName" value={firstName} onChange={this.handleOnChange} />

                                <TextField id="lastName" variant="outlined" margin="normal" required fullWidth type="text"
                                    label="Apellido" name="lastName" value={lastName} onChange={this.handleOnChange} />

                                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 2, bgcolor: "#002366" }}>Crear Usuario</Button>

                                <Link href="/login" variant="body2" color="#002366">¿Ya tienes una cuenta? Inicia sesión</Link>

                            </Box>
                        </Box>
                    </Container >
                </Box >
        )
    }
}