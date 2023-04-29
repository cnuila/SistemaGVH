import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import React, { Component, SyntheticEvent } from 'react'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import IMessage from '../../Utilities/Interfaces/IMessage'
import IDeliveryLocationData from '../../Utilities/Interfaces/IDeliveryLocationData'
import DeliveryLocationService from '../../Services/DeliveryLocationService'

type Props = { } 

type State = {
    name: string,
    address: string,
    message: IMessage,
    deliveryLocationCreated: boolean
}

export default class AddDeliveryLocation extends Component<Props, State> {

    state: State = {
        name: "",
        address: "",
        message: {
            show: false,
            text: "",
            type: "success"
        },
        deliveryLocationCreated: false
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "name") {
            this.setState({ name: value })
        }
        if (name === "address") {
            this.setState({ address: value })
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { name, address } = this.state
                const deliveryLocationToAdd: IDeliveryLocationData = {
                    id: null,
                    name,
                    address,
                }

                const response = await DeliveryLocationService.addDeliveryLocation(deliveryLocationToAdd)
                if (response.status === 201) {
                    this.setState({
                        deliveryLocationCreated: true
                    })
                }

            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { name, address } = this.state
        if (name === "") {
            this.prepareMessage("Debes ingresar un Nombre", true);
            return false
        }

        if (address === "") {
            this.prepareMessage("Debes ingresar una Dirección", true);
            return false
        }
        return true
    }

    prepareMessage = (message: string, isError: boolean) => {
        this.setState({
            message: {
                show: true,
                text: message,
                type: isError ? "error" : "success"
            }
        })
    }

    handleOnMessageClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            message: {
                show: false,
                text: "",
                type: "success"
            }
        });
    };


    render() {
        const { name, address, message, deliveryLocationCreated } = this.state

        if (deliveryLocationCreated) {
            return (<Navigate to={"/lugaresentrega"} replace />)
        }

        return (
            <React.Fragment>
                <Snackbar open={message.show} autoHideDuration={5000} onClose={this.handleOnMessageClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                    <Alert onClose={this.handleOnMessageClose} severity={message.type} sx={{ width: '100%' }}>
                        {message.text}
                    </Alert>
                </Snackbar>
                <NavBar />
                <Box sx={{ height: "100vh", display: "flex" }}>
                    <Container>
                        <Box sx={{ my: 3 }}>
                            <Typography variant="h4" sx={{ color: "#464555" }}>
                                <b>Crear Lugar de Entrega</b>
                            </Typography>

                        </Box>
                        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} noValidate onSubmit={this.handleOnSubmit}>
                            <TextField id="name" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Nombre" name="name" value={name} onChange={this.handleOnChange}
                            />
                            <TextField id="address" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Dirección" name="address" value={address} onChange={this.handleOnChange} />

                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Crear</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
