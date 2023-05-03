import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Edit, Delete } from '@mui/icons-material'
import NavBar from '../NavBar'
import IProductDeliveryData from '../../Utilities/Interfaces/IProductDeliveryData'
import ProductDeliveryService from '../../Services/ProductDeliveryService'
import IMessage from '../../Utilities/Interfaces/IMessage'
import { getError } from '../../Utilities/ErrorHandler'

type Props = {}

type State = {
    productDelivery: Array<IProductDeliveryData>,
    columnHeaders: Array<GridColDef<IProductDeliveryData>>,
    goToAnotherPage: boolean,
    goToAddress: string,
    message: IMessage
}


export default class ProductDelivery extends Component<Props, State>{
    state: State = {
        productDelivery: [],
        columnHeaders: [
            { field: "deliveryLocationId__name", headerName: "Ubicacion de Entrega", headerAlign: "center", align:"center", width: 150, type: "string" },
            { field: "productId__description", headerName: "Producto Entregado", headerAlign: "center", align:"center", width: 150, type: "string" },
            { field: "expirationDate", headerName: "Fecha de Expiracion", headerAlign: "center", align:"center", width: 150, type: "Date" },  
            { field: "quantityDelivered", headerName: "Cantidad Entregada", headerAlign: "center", align:"center", width: 150, type: "number" },  
            { field: "quantityReturned", headerName: "Cantidad Devuelta", headerAlign: "center", align:"center", width: 150, type: "number" },  
            { field: "soldPrice", headerName: "Precio Vendido", headerAlign: "center", align:"center", width: 150, type: "number" },           
            {
                field: "Actions", type: "actions", width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Edit sx={{color: "#464555"}}/>}
                        label="Edit"
                        onClick={() => this.editProductDeliveryClicked(params.id)}
                    />,
                    <GridActionsCellItem
                        icon={<Delete sx={{color: "#464555"}}/>}
                        label="Delete"
                        onClick={() => this.deleteProductDelivery(params.row.id!)}
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
        const productDelivery = (await ProductDeliveryService.getAll()).data
        this.setState({
            productDelivery
        })
    }

    addProductDeliveryClicked = () => {        
        this.setState({
            goToAnotherPage: true,
            goToAddress: "/entregaproducto/crear"
        })
    }

    editProductDeliveryClicked = (productDeliveryId: GridRowId) => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: `/entregaproducto/${productDeliveryId}`
        })
    }

    deleteProductDelivery = async (productDeliveryId: number) => {
        try {
            const response = await ProductDeliveryService.deleteProductDelivery(productDeliveryId)

            if (response.status === 200){
                const productDelivery = (await ProductDeliveryService.getAll()).data
                this.prepareMessage("La Entrega de Producto fue eliminada correctamente.", false)
                this.setState({
                    productDelivery
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
        const { productDelivery, columnHeaders, message, goToAnotherPage, goToAddress } = this.state 

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
                                <b>Entregas de Productos</b>
                            </Typography>

                        </Box>
                        <Box>
                            <Button variant='contained' sx={{ bgcolor: "#002366", mb: 2 }} onClick={() => this.addProductDeliveryClicked()}>Agregar Entrega de Producto</Button>
                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                sx={{ boxShadow: 3 }}
                                columns={columnHeaders}
                                rows={productDelivery}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}

