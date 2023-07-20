import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId , esES} from '@mui/x-data-grid'
import { Edit, Delete } from '@mui/icons-material'
import NavBar from '../NavBar'
import DeliveryLocationService from '../../Services/DeliveryLocationService'
import IMessage from '../../Utilities/Interfaces/IMessage'
import { getError } from '../../Utilities/ErrorHandler'
import IDeliveryLocationViewData from '../../Utilities/Interfaces/IDeliveryLocationViewData'

type Props = {}

type State = {
    deliveryLocations: Array<IDeliveryLocationViewData>,
    columnHeaders: Array<GridColDef<IDeliveryLocationViewData>>,
    goToAnotherPage: boolean,
    goToAddress: string,
    message: IMessage
}

export default class DeliveryLocations extends Component<Props, State> {

    state: State = {
        deliveryLocations: [],
        columnHeaders: [
            { field: "name", headerName: "Nombre", headerAlign: "center", align:"center", width: 150, type: "string" },
            { field: "address", headerName: "Dirección", headerAlign: "center", align:"center", width: 150, type: "string" },
            { field: "deliveryZoneName", headerName: "Zona de Entrega", headerAlign: "center", align:"center", width: 150, type: "string" },
            {
                field: "Actions", type: "actions", width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Edit sx={{color: "#464555"}}/>}
                        label="Edit"
                        onClick={() => this.editDeliveryLocationClicked(params.id)}
                    />,
                    <GridActionsCellItem
                        icon={<Delete sx={{color: "#464555"}}/>}
                        label="Delete"
                        onClick={() => this.deleteDeliveryLocation(params.row.id!)}
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
        const deliveryLocations = (await DeliveryLocationService.getAll()).data
        this.setState({
            deliveryLocations
        })
    }

    addDeliveryLocationClicked = () => {        
        this.setState({
            goToAnotherPage: true,
            goToAddress: "/lugaresentrega/crear"
        })
    }

    editDeliveryLocationClicked = (deliveryLocationId: GridRowId) => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: `/lugaresentrega/${deliveryLocationId}`
        })
    }

    deleteDeliveryLocation = async (deliveryLocationId: number) => {
        try {
            const response = await DeliveryLocationService.deleteDeliveryLocation(deliveryLocationId)

            if (response.status === 200){
                const deliveryLocations = (await DeliveryLocationService.getAll()).data
                this.prepareMessage("Lugar de Entrega eliminado correctamente.", false)
                this.setState({
                    deliveryLocations
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
        const { deliveryLocations, columnHeaders, message, goToAnotherPage, goToAddress } = this.state 

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
                                <b>Lugares de Entrega</b>
                            </Typography>

                        </Box>
                        <Box>
                            <Button variant='contained' sx={{ bgcolor: "#002366", mb: 2 }} onClick={() => this.addDeliveryLocationClicked()}>Agregar Lugar de Entrega</Button>
                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                sx={{ boxShadow: 3 }}
                                columns={columnHeaders}
                                rows={deliveryLocations}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
