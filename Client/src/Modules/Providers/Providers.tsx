import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, esES } from '@mui/x-data-grid'
import { Edit, Delete } from '@mui/icons-material'
import NavBar from '../NavBar'
import IProviderData from '../../Utilities/Interfaces/IProviderData'
import ProviderService from '../../Services/ProviderService'
import IMessage from '../../Utilities/Interfaces/IMessage'
import { getError } from '../../Utilities/ErrorHandler'

type Props = {}

type State = {
    providers: Array<IProviderData>,
    columnHeaders: Array<GridColDef<IProviderData>>,
    goToAnotherPage: boolean,
    goToAddress: string,
    message: IMessage
}

export default class Providers extends Component<Props, State> {

    state: State = {
        providers: [],
        columnHeaders: [
            { field: "name", headerName: "Nombre", headerAlign: "center", align: "center", width: 150, type: "string" },
            {
                field: "Actions", type: "actions", width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Edit sx={{ color: "#464555" }} />}
                        label="Edit"
                        onClick={() => this.editProviderClicked(params.id)}
                    />,
                    <GridActionsCellItem
                        icon={<Delete sx={{ color: "#464555" }} />}
                        label="Delete"
                        onClick={() => this.deleteProvider(params.row.id!)}
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
        const providers = (await ProviderService.getAll()).data
        this.setState({
            providers
        })
    }

    addProviderClicked = () => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: "/proveedores/crear"
        })
    }

    editProviderClicked = (providerId: GridRowId) => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: `/proveedores/${providerId}`
        })
    }

    deleteProvider = async (providerId: number) => {
        try {
            const response = await ProviderService.deleteProvider(providerId)

            if (response.status === 200) {
                const providers = (await ProviderService.getAll()).data
                this.prepareMessage("Proveedor eliminado correctamente.", false)
                this.setState({
                    providers
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

        const { providers, columnHeaders, message, goToAnotherPage, goToAddress } = this.state

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
                                <b>Proveedores</b>
                            </Typography>

                        </Box>
                        <Box>
                            <Button variant='contained' sx={{ bgcolor: "#002366", mb: 2 }} onClick={() => this.addProviderClicked()}>Agregar Proveedor</Button>
                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                sx={{ boxShadow: 3 }}
                                columns={columnHeaders}
                                rows={providers}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}