import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';

import React, { Component, SyntheticEvent } from 'react'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'

import IMessage from '../../Utilities/Interfaces/IMessage'
import IProductDeliveryData from '../../Utilities/Interfaces/IProductDeliveryData'
import IDeliveryLocationData from '../../Utilities/Interfaces/IDeliveryLocationData';
import ProductDeliveryService from '../../Services/ProductDeliveryService'
import DeliveryLocationService from '../../Services/DeliveryLocationService'
import ProductService from '../../Services/ProductService';
import IProductViewData from '../../Utilities/Interfaces/IProductViewData';

type Props = {}

type State = {
    deliveryLocationChoosed: IDeliveryLocationData | null,
    productChoosed: IProductViewData | null,
    expirationDate: Date | null,
    quantityDelivered: string,
    soldPrice: string,
    deliveryDate: Date | null,
    message: IMessage,
    productDeliveryCreated: boolean
    openProducts: boolean,
    openDeliveryLocations: boolean,
    products: IProductViewData[],
    deliveryLocations: IDeliveryLocationData[]
}

export default class AddProductDelivery extends Component<Props, State>{

    state: State = {
        deliveryLocationChoosed: null,
        productChoosed: null,
        expirationDate: null,
        quantityDelivered: "0",
        soldPrice: "0",
        deliveryDate: new Date(),
        message: {
            show: false,
            text: "",
            type: "success"
        },
        productDeliveryCreated: false,
        openProducts: false,
        openDeliveryLocations: false,
        products: [],
        deliveryLocations: []
    }

    async componentDidMount() {
        const products = (await ProductService.getAll()).data
        const deliveryLocations = (await DeliveryLocationService.getAll()).data
        this.setState({ deliveryLocations, products })
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const wholeNumberRegex = /^\d*$/
        const decimalRegex = /^\d*\.?\d*$/

        if (name === "quantityDelivered") {
            if (wholeNumberRegex.test(value)) {
                this.setState({ quantityDelivered: value })
            }
        }
        if (name === "soldPrice") {
            if (decimalRegex.test(value)) {
                this.setState({ soldPrice: value })
            }
        }
    }
    handleExpirationDateOnChange = (date: Date | null) => {
        this.setState({
            expirationDate: date,
        });
    }
    handleDeliveryDateOnChange = (date: Date | null) => {
        this.setState({
            deliveryDate: date,
        });
    }

    handleDeliveryLocationChange = (event: SyntheticEvent<Element, Event>, value: IDeliveryLocationData | null) => {
        if (value !== null) {
            this.setState({ deliveryLocationChoosed: value });
        } else {
            this.setState({ deliveryLocationChoosed: null });
        }
    }
    handleProductChange = (event: SyntheticEvent<Element, Event>, value: IProductViewData | null) => {
        if (value !== null) {
            this.setState({ productChoosed: value });
        } else {
            this.setState({ productChoosed: null });
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice, deliveryDate } = this.state
                const productDeliveryToAdd: IProductDeliveryData = {
                    id: null,
                    deliveryLocationId: deliveryLocationChoosed!.id,
                    productId: productChoosed!.id,
                    expirationDate: expirationDate ? expirationDate.toISOString().split("T")[0] : '',
                    quantityDelivered: +quantityDelivered,
                    quantityReturned: null,
                    soldPrice: +soldPrice,
                    deliveryDate: deliveryDate ? deliveryDate.toISOString().split("T")[0] : '',
                    observations: null
                }
                const response = await ProductDeliveryService.addProductDelivery(productDeliveryToAdd)
                if (response.status === 201) {
                    this.setState({
                        productDeliveryCreated: true
                    })
                }

            } catch (error) {
                console.error(error);
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice, deliveryDate } = this.state
        if (deliveryLocationChoosed === null) {
            this.prepareMessage("Debes ingresar un Nombre de Ubicacion", true);
            return false
        }
        if (productChoosed === null) {
            this.prepareMessage("Debes ingresar un Nombre de producto", true);
            return false
        }
        if (expirationDate === null) {
            this.prepareMessage("Debes ingresar una fecha de expiracion", true);
            return false
        }
        if (quantityDelivered === "" || +quantityDelivered === 0) {
            this.prepareMessage("Debes ingresar una cantidad distinta a 0", true);
            return false
        }
        if (soldPrice === "" || +soldPrice === 0) {
            this.prepareMessage("Debes ingresar un Precio de Venta distinto a 0", true);
            return false
        }
        if (deliveryDate === null) {
            this.prepareMessage("Debes ingresar una fecha de entrega", true);
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
        const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice, deliveryDate, message, productDeliveryCreated, openProducts, openDeliveryLocations, products, deliveryLocations } = this.state

        if (productDeliveryCreated) {
            return (<Navigate to={"/entregaproducto"} replace />)
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
                                <b>Crear Entrega de Producto</b>
                            </Typography>

                        </Box>
                        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} noValidate onSubmit={this.handleOnSubmit}>
                            <Autocomplete
                                id="deliveryLocation"
                                sx={{ marginTop: 2 }}
                                open={openDeliveryLocations}
                                onOpen={() => {
                                    this.setState({ openDeliveryLocations: true })
                                }}
                                onClose={() => {
                                    this.setState({ openDeliveryLocations: false })
                                }}

                                isOptionEqualToValue={(option: IDeliveryLocationData, value: IDeliveryLocationData) => option.name === value.name}
                                getOptionLabel={(option: IDeliveryLocationData) => option.name}
                                options={deliveryLocations}
                                onChange={this.handleDeliveryLocationChange}
                                value={deliveryLocationChoosed}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Ubicacion de Entrega"
                                        required

                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Autocomplete
                                id="product"
                                sx={{ marginTop: 2 }}
                                open={openProducts}
                                onOpen={() => {
                                    this.setState({ openProducts: true })
                                }}
                                onClose={() => {
                                    this.setState({ openProducts: false })
                                }}
                                isOptionEqualToValue={(option: IProductViewData, value: IProductViewData) => option.description === value.description}
                                getOptionLabel={(option: IProductViewData) => option.description}
                                options={products}
                                onChange={this.handleProductChange}
                                value={productChoosed}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nombre del Producto"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <br></br>
                            <LocalizationProvider dateAdapter={AdapterDateFns} >
                                <DatePicker
                                    // @ts-expect-error
                                    id="expirationDate" variant="outlined" margin="normal" required fullWidth
                                    label="Fecha Expiracion * (MM-DD-YYYY)" name="expirationDate" value={expirationDate} onChange={this.handleExpirationDateOnChange} />
                            </LocalizationProvider>

                            <TextField id="quantityDelivered" variant="outlined" margin="normal" required fullWidth
                                label="Cantidad Entregada" name="quantityDelivered" value={quantityDelivered} onChange={this.handleOnChange} />

                            <TextField id="soldPrice" variant="outlined" margin="normal" required fullWidth
                                label="Precio Venta" name="soldPrice" value={soldPrice} onChange={this.handleOnChange} />

                            <LocalizationProvider dateAdapter={AdapterDateFns} >
                                <DatePicker
                                    // @ts-expect-error
                                    id="deliveryDate" variant="outlined" margin="normal" required fullWidth sx={{marginTop: "15px"}}
                                    label="Fecha Entrega * (MM-DD-YYYY)" name="deliveryDate" value={deliveryDate} onChange={this.handleDeliveryDateOnChange} />
                            </LocalizationProvider>


                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Crear</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
