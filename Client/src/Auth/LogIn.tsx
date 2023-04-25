import React, { Component, SyntheticEvent } from "react";
import {
  Avatar, Button, Box, Container, FormControl, IconButton, InputAdornment, InputLabel, Link,
  OutlinedInput, TextField, Typography, Alert, Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { Navigate } from "react-router-dom";
import { logUserIn } from "./AuthOperations"
import { getError } from "../Utilities/ErrorHandler"

type Props = {};

type State = {
  showPassword: boolean,
  email: string,
  password: string,
  showError: boolean,
  errorMessage: string,
  userLoggedIn: boolean,
};

export default class LogIn extends Component<Props, State> {
  state: State = {
    showPassword: false,
    email: "",
    password: "",
    showError: false,
    errorMessage: "",
    userLoggedIn: false,
  };

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

  handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "email") {
      this.setState({ email: value })
    }
    if (name === "password") {
      this.setState({ password: value })
    }
  }

  handleOnSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { email, password } = this.state
    try {
      await logUserIn(email, password)      
      setTimeout(() => {
        this.setState({
          userLoggedIn: true
        })  
      }, 500);
      
    } catch (error) {
      let convertedError = getError(error)
      if (convertedError.code === "auth/invalid-email" || convertedError.code === "auth/wrong-password") {
        this.prepareErrorMessage("Ingresaste un correo o contraseña incorrecta.")
      } else {
        this.prepareErrorMessage("Error desconocido, intenta luego.")
      }

    }
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
    const { showPassword, email, password, showError, errorMessage, userLoggedIn } = this.state
    return (
      userLoggedIn ? <Navigate to={"/home"} replace /> :
      <Box sx={{ bgcolor: "#002366", height: "100vh", display: "flex" }}>

        <Snackbar open={showError} autoHideDuration={5000} onClose={this.handleOnErrorClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={this.handleOnErrorClose} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>

        <Container maxWidth="xs" sx={{ m: "auto" }}>
          <Box
            sx={{
              bgcolor: "white", display: "flex", flexDirection: "column", alignItems: "center",
              borderRadius: "8px", px: 4, py: 2
            }}
          >

            <Avatar sx={{ m: 1, bgcolor: "#002366" }}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5">Iniciar Sesión</Typography>

            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={this.handleOnSubmit}>
              <TextField id="email" variant="outlined" margin="normal" required fullWidth type="email" autoFocus
                label="Correo Electrónico" name="email" value={email} onChange={this.handleOnChange} />

              <FormControl variant="outlined" margin="normal" required fullWidth>
                <InputLabel>Contraseña</InputLabel>
                <OutlinedInput id="password" type={showPassword ? "text" : "password"}
                  label="Contraseña" name="password" value={password} onChange={this.handleOnChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 2, bgcolor: "#002366" }}>Iniciar Sesión</Button>

              <Link href="/register" variant="body2" color="#002366">¿No tienes una cuenta? Crea una</Link>

            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
}
