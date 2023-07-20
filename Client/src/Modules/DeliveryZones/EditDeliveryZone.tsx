import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import React, { Component, SyntheticEvent } from 'react'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import IMessage from '../../Utilities/Interfaces/IMessage'
import IDeliveryZoneData from '../../Utilities/Interfaces/IDeliveryZoneData'
import DeliveryZoneService from '../../Services/DeliveryZoneService'

type Props = {}

type State = {
    deliveryZoneId: number,
    name: string,
    message: IMessage
    deliveryZoneEdited: boolean
}

export default class EditDeliveryZone extends Component<Props, State> {
    
    state: State = {
        deliveryZoneId: +document.location.pathname.split("/")[2],
        name: "",
        message: {
            show: false,
            text: "",
            type: "success"
        },
        deliveryZoneEdited: false
    }

    async componentDidMount() {
        const { deliveryZoneId } = this.state
        const deliveryZone = (await DeliveryZoneService.getById(deliveryZoneId)).data
        this.setState({
            name: deliveryZone.name,
        })
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "name") {
            this.setState({ name: value })
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { deliveryZoneId, name } = this.state
                const deliveryZoneToEdit: IDeliveryZoneData = {
                    id: deliveryZoneId,
                    name,
                }

                const response = await DeliveryZoneService.updateDeliveryZone(deliveryZoneId, deliveryZoneToEdit)
                if (response.status === 200) {
                    this.setState({
                        deliveryZoneEdited: true
                    })
                }

            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { name } = this.state
        if (name === "") {
            this.prepareMessage("Debes ingresar un Nombre", true);
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
        const { name, message, deliveryZoneEdited } = this.state

        if (deliveryZoneEdited) {
            return (<Navigate to={"/zonasentrega"} replace />)
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
                                <b>Editar Zona de Entrega</b>
                            </Typography>

                        </Box>
                        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} noValidate onSubmit={this.handleOnSubmit}>
                            <TextField id="name" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Nombre" name="name" value={name} onChange={this.handleOnChange}
                            />                            

                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Editar</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}