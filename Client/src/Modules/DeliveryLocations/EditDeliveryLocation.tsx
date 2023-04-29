import React, { Component, SyntheticEvent } from 'react'
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import IMessage from '../../Utilities/Interfaces/IMessage'
import IDeliveryLocationData from '../../Utilities/Interfaces/IDeliveryLocationData'
import DeliveryLocationService from '../../Services/DeliveryLocationService'

type Props = { } 

type State = {
    deliveryLocationId: number,
    name: string,
    address: string,
    message: IMessage,
    deliveryLocationEdited: boolean
}

export default class EditDeliveryLocation extends Component<Props,State> {

    state: State = {
        deliveryLocationId: +document.location.pathname.split("/")[2],
        name: "",
        address: "",
        message: {
            show: false,
            text: "",
            type: "success"
        },
        deliveryLocationEdited: false
    }

    async componentDidMount() {
        const { deliveryLocationId } = this.state
        const deliveryLocation = (await DeliveryLocationService.getById(deliveryLocationId)).data
        this.setState({
            name: deliveryLocation.name,
            address: deliveryLocation.address,
        })
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
                const { deliveryLocationId, name, address } = this.state
                const deliveryLocationToEdit: IDeliveryLocationData = {
                    id: deliveryLocationId,
                    name,
                    address,
                }

                const response = await DeliveryLocationService.updateDeliveryLocation(deliveryLocationId, deliveryLocationToEdit)
                if (response.status === 200) {
                    this.setState({
                        deliveryLocationEdited: true
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
    const { name, address, message, deliveryLocationEdited } = this.state

        if (deliveryLocationEdited) {
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
                                <b>Editar Lugar de Entrega</b>
                            </Typography>

                        </Box>
                        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} noValidate onSubmit={this.handleOnSubmit}>
                            <TextField id="name" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Nombre" name="name" value={name} onChange={this.handleOnChange}
                            />
                            <TextField id="address" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Dirección" name="address" value={address} onChange={this.handleOnChange} />

                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Editar</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
  }
}
