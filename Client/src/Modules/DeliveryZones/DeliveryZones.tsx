import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, esES } from '@mui/x-data-grid'
import { Edit, Delete } from '@mui/icons-material'
import NavBar from '../NavBar'
import IDeliveryZoneData from '../../Utilities/Interfaces/IDeliveryZoneData'
import DeliveryZoneService from '../../Services/DeliveryZoneService'
import IMessage from '../../Utilities/Interfaces/IMessage'
import { getError } from '../../Utilities/ErrorHandler'

type Props = {}

type State = {
    deliveryZones: Array<IDeliveryZoneData>,
    columnHeaders: Array<GridColDef<IDeliveryZoneData>>,
    goToAnotherPage: boolean,
    goToAddress: string,
    message: IMessage
}

export default class DeliveryZones extends Component<Props, State> {

    state: State = {
        deliveryZones: [],
        columnHeaders: [
            { field: "name", headerName: "Nombre", headerAlign: "center", align: "center", width: 300, type: "string" },            
            {
                field: "Actions", type: "actions", width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Edit sx={{ color: "#464555" }} />}
                        label="Edit"
                        onClick={() => this.editDeliveryZoneClicked(params.id)}
                    />,
                    <GridActionsCellItem
                        icon={<Delete sx={{ color: "#464555" }} />}
                        label="Delete"
                        onClick={() => this.deleteDeliveryZone(params.row.id!)}
                    />,
                ]
            },
        ],
        goToAnotherPage: false,
        goToAddress: "",
        message: {
            show: false,
            text: "",
            type: "success"
        }
    }

    async componentDidMount() {
        const deliveryZones = (await DeliveryZoneService.getAll()).data
        this.setState({
            deliveryZones
        })
    }

    addDeliveryZoneClicked = () => {        
        this.setState({
            goToAnotherPage: true,
            goToAddress: "/zonasentrega/crear"
        })
    }

    editDeliveryZoneClicked = (deliveryZoneId: GridRowId) => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: `/zonasentrega/${deliveryZoneId}`
        })
    }

    deleteDeliveryZone = async (deliveryZoneId: number) => {
        try {
            const response = await DeliveryZoneService.deleteDeliveryZone(deliveryZoneId)

            if (response.status === 200){
                const deliveryZones = (await DeliveryZoneService.getAll()).data
                this.prepareMessage("Zona de Entrega eliminado correctamente.", false)
                this.setState({
                    deliveryZones
                })
            }
        } catch (error) {
            let convertedError = getError(error)
            this.prepareMessage(convertedError.message, true)
        }
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
        const { deliveryZones, columnHeaders, message, goToAnotherPage, goToAddress } = this.state 

        if (goToAnotherPage) {
            return (<Navigate to={goToAddress} replace />)
        }

        return (
            <React.Fragment>
                <Snackbar open={message.show} autoHideDuration={5000} onClose={this.handleOnMessageClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                    <Alert onClose={this.handleOnMessageClose} severity={message.type} sx={{ width: '100%' }}>
                        {message.text}
                    </Alert>
                </Snackbar>

                <NavBar />
                <Box sx={{ height: "100vh", display: "flex", }}>
                    <Container>
                        <Box sx={{ my: 3 }}>
                            <Typography variant="h4" sx={{ color: "#464555" }}>
                                <b>Zonas de Entrega</b>
                            </Typography>

                        </Box>
                        <Box>
                            <Button variant='contained' sx={{ bgcolor: "#002366", mb: 2 }} onClick={() => this.addDeliveryZoneClicked()}>Agregar Zona de Entrega</Button>
                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                sx={{ boxShadow: 3}}
                                columns={columnHeaders}
                                rows={deliveryZones}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}