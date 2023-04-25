import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Delete, Edit } from '@mui/icons-material'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import IProductData from '../../Utilities/Interfaces/IProductData'
import IMessage from '../../Utilities/Interfaces/IMessage'
import ProductService from '../../Services/ProductService'
import { getError } from '../../Utilities/ErrorHandler'

type Props = {}

type State = {
    products: Array<IProductData>,
    columnHeaders: Array<GridColDef<IProductData>>,
    goToAnotherPage: boolean,
    goToAddress: string,
    message: IMessage
}

export default class Products extends Component<Props, State> {

    state: State = {
        products: [],
        columnHeaders: [
            { field: "code", headerName: "Código", headerAlign: "center", align:"center", width: 150, type: "string" },
            { field: "description", headerName: "Descripción", headerAlign: "center", align:"center", width: 150, type: "string" },
            { field: "cost", headerName: "Costo", headerAlign: "center", align:"center", width: 150, type: "number" },
            { field: "sellingPrice", headerName: "Precio de Venta", headerAlign: "center", align:"center", width: 150, type: "number" },
            { field: "quantity", headerName: "Cantidad", headerAlign: "center", align:"center", width: 150, type: "number" },
            {
                field: "Actions", type: "actions", width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Edit sx={{color: "#464555"}}/>}
                        label="Edit"
                        onClick={() => this.editProductClicked(params.id)}
                    />,
                    <GridActionsCellItem
                        icon={<Delete sx={{color: "#464555"}}/>}
                        label="Delete"
                        onClick={() => this.deleteProduct(params.row.id!)}
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
        const products = (await ProductService.getAll()).data
        this.setState({
            products
        })
    }

    addProductClicked = () => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: "/productos/crear"
        })
    }

    editProductClicked = (productId: GridRowId) => {
        this.setState({
            goToAnotherPage: true,
            goToAddress: `/productos/${productId}`
        })
    }

    deleteProduct = async (productId: number) => {
        try {
            const response = await ProductService.deleteProduct(productId)
            if (response.status === 200){
                const products = (await ProductService.getAll()).data
                this.prepareMessage("Producto eliminado correctamente.", false)
                this.setState({
                    products
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
        const { products, columnHeaders, message, goToAnotherPage, goToAddress } = this.state

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
                <Box sx={{ height: "100vh", display: "flex" }}>
                    <Container>
                        <Box sx={{ my: 3 }}>
                            <Typography variant="h4" sx={{ color: "#464555" }}>
                                <b>Productos</b>
                            </Typography>

                        </Box>
                        <Box>
                            <Button variant='contained' sx={{ bgcolor: "#002366", mb: 2 }} onClick={() => this.addProductClicked()}>Agregar Producto</Button>
                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                sx={{ boxShadow: 3 }}
                                columns={columnHeaders}
                                rows={products}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
