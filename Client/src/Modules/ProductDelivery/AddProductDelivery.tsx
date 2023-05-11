import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'

import Autocomplete from '@mui/material/Autocomplete';
import React, { Component, SyntheticEvent } from 'react'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import IMessage from '../../Utilities/Interfaces/IMessage'
import IProductDeliveryData from '../../Utilities/Interfaces/IProductDeliveryData'
import IProductData from '../../Utilities/Interfaces/IProductData'
import IDeliveryLocationData from '../../Utilities/Interfaces/IDeliveryLocationData';
import ProductDeliveryService from '../../Services/ProductDeliveryService'
import DeliveryLocationService from '../../Services/DeliveryLocationService'
import ProductService from '../../Services/ProductService';

type Props = {}

type State = {
    deliveryLocationChoosed: IDeliveryLocationData | null,
    productChoosed: IProductData | null,
    expirationDate: string,
    quantityDelivered: string,
    soldPrice: string,
    message: IMessage,
    productDeliveryCreated: boolean
    openProducts: boolean,
    openDeliveryLocations: boolean,
    products: IProductData[],
    deliveryLocations: IDeliveryLocationData[]
}




export default class AddProductDelivery extends Component<Props, State>{
    state: State = {
        deliveryLocationChoosed: null,
        productChoosed: null,
        expirationDate: "",
        quantityDelivered: "0",
        soldPrice: "0",
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

    // componentDidMount() {
    //     DeliveryLocationService.getDeliveryLocationNames().then((response) => {
    //       this.setState({ deliveryLocationsListAutoComplete: response.data });
    //     });
    // }
    async componentDidMount() {
        const products = (await ProductService.getAll()).data
        // console.log(products)
        const deliveryLocations = (await DeliveryLocationService.getAll()).data
        // console.log(deliveryLocations)
        this.setState({ deliveryLocations })
        this.setState({ products })
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const wholeNumberRegex = /^\d*$/
        const decimalRegex = /^\d*\.?\d*$/
        console.log(name + " " + value)

        if (name === "expirationDate") {
            this.setState({ expirationDate: value })
        }
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

    handleDeliveryLocationChange = (event: SyntheticEvent<Element, Event>, value: IDeliveryLocationData | null) => {
        if (value !== null) {
            this.setState({ deliveryLocationChoosed: value });
        } else {
            this.setState({ deliveryLocationChoosed: null });
        }
    }
    handleProductChange = (event: SyntheticEvent<Element, Event>, value: IProductData | null) => {
        if (value !== null) {
            this.setState({ productChoosed: value });
        } else {
            this.setState({ productChoosed: null });
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            console.log("validations passed")
            try {
                const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice } = this.state
                const productDeliveryToAdd: IProductDeliveryData = {
                    id: null,
                    deliveryLocationId: deliveryLocationChoosed!.id,
                    productId: productChoosed!.id,
                    expirationDate,
                    quantityDelivered: +quantityDelivered,
                    quantityReturned: null,
                    soldPrice: +soldPrice,
                }
                console.log("3")
                //console.log(productDeliveryToAdd)
                const response = await ProductDeliveryService.addProductDelivery(productDeliveryToAdd)
                if (response.status === 201) {
                    this.setState({
                        productDeliveryCreated: true
                    })
                }

            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice, deliveryLocations } = this.state
        console.log(deliveryLocationChoosed)
        console.log(productChoosed)
        // const selectedLocation = deliveryLocations.find(location => location.name === newValue.name);
        // const selectedLocationId = selectedLocation.id;
        if (deliveryLocationChoosed === null) {
            this.prepareMessage("Debes ingresar un Nombre de Ubicacion", true);
            return false
        }
        if (productChoosed === null) {
            this.prepareMessage("Debes ingresar un Nombre de producto", true);
            return false
        }
        if (expirationDate === "") {
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
        const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice, message, productDeliveryCreated, openProducts, openDeliveryLocations, products, deliveryLocations } = this.state

        if (productDeliveryCreated) {
            return (<Navigate to={"/entregaproducto"} replace />)
        }

        function setValue(newValue: string | null): void {
            throw new Error('Function not implemented.');
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

                            {/* <TextField id="deliveryLocationId__name" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Nombre Ubicacion" name="deliveryLocationId__name" value={deliveryLocationId__name} onChange={this.handleOnChange}/> */}


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
                                // loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Ubicacion de Entrega"
                                        required

                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {/* {loading ? <CircularProgress color="inherit" size={20} /> : null} */}
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
                                isOptionEqualToValue={(option: IProductData, value: IProductData) => option.description === value.description}
                                getOptionLabel={(option: IProductData) => option.description}
                                options={products}
                                onChange={this.handleProductChange}
                                value={productChoosed}
                                // loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nombre del Producto"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {/* {loading ? <CircularProgress color="inherit" size={20} /> : null} */}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <TextField id="expirationDate" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Fecha Expiracion (YYYY-MM-DD)" name="expirationDate" value={expirationDate} onChange={this.handleOnChange} />

                            {/* <TextField id="expirationDate" variant="outlined" margin="normal" required fullWidth type="date"
                                label="Fecha de Expiracion" name="expirationDate"  value={expirationDate} 
                                //onChange={this.handleOnChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            /> */}
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Basic date picker" />
                            </LocalizationProvider> */}
                            
                            <TextField id="quantityDelivered" variant="outlined" margin="normal" required fullWidth
                                label="Cantidad Entregada" name="quantityDelivered" value={quantityDelivered} onChange={this.handleOnChange} />
                            {/* <TextField id="quantityReturned" variant="outlined" margin="normal" required fullWidth
                                label="Cantidad Devuelta" name="quantityReturned" value={quantityReturned} onChange={this.handleOnChange} /> */}
                            <TextField id="soldPrice" variant="outlined" margin="normal" required fullWidth
                                label="Precio Venta" name="soldPrice" value={soldPrice} onChange={this.handleOnChange} />





                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Crear</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
