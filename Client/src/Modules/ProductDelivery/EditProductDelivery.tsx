import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'

import Autocomplete from '@mui/material/Autocomplete';

import React, { Component, SyntheticEvent } from 'react'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import IMessage from '../../Utilities/Interfaces/IMessage'
import IProductDeliveryData from '../../Utilities/Interfaces/IProductDeliveryData'
import IProductData from '../../Utilities/Interfaces/IProductData'
import IDeliveryLocationData from '../../Utilities/Interfaces/IDeliveryLocationData';
import ProductDeliveryService from '../../Services/ProductDeliveryService'
import DeliveryLocationService from '../../Services/DeliveryLocationService'
import ProductService from '../../Services/ProductService';

type Props = {}

type State = {
    productDeliveryId: number,
    deliveryLocationChoosed: IDeliveryLocationData | null,
    productChoosed: IProductData | null,
    expirationDate: string,
    quantityDelivered: string,
    quantityReturned: string,
    soldPrice: string,
    productDeliveryCreated: boolean,
    openProducts: boolean,
    openDeliveryLocations: boolean,
    products: IProductData[],
    deliveryLocations: IDeliveryLocationData[],
    message: IMessage,
    productDeliveryEdited: boolean,
}

export default class extends Component<Props, State> {
    state: State = {
        productDeliveryId: +document.location.pathname.split("/")[2],
        deliveryLocationChoosed: null,
        productChoosed: null,
        expirationDate: "",
        quantityDelivered: "0",
        quantityReturned: "0",
        soldPrice: "0",
        productDeliveryCreated: false,
        openProducts: false,
        openDeliveryLocations: false,
        products: [],
        deliveryLocations: [],
        message: {
            show: false,
            text: "",
            type: "success"
        },
        productDeliveryEdited: false
    }

    async componentDidMount() {
        const products = (await ProductService.getAll()).data
        const deliveryLocations = (await DeliveryLocationService.getAll()).data
        this.setState({ deliveryLocations })
        this.setState({ products })

        const { productDeliveryId } = this.state
        const productDelivery = (await ProductDeliveryService.getById(productDeliveryId)).data
        if (productDelivery.quantityReturned === null) {
            this.setState({ quantityReturned: "" })
        } else {
            this.setState({ quantityReturned: productDelivery.quantityReturned.toString() })
        }
        this.setState({
            deliveryLocationChoosed: deliveryLocations.find((item) => item.id === productDelivery.deliveryLocationId) || null,
            productChoosed: products.find((item) => item.id === productDelivery.productId) || null,
            expirationDate: productDelivery.expirationDate.toString(),
            quantityDelivered: productDelivery.quantityDelivered.toString(),
            soldPrice: productDelivery.soldPrice.toString()
        })
        console.log(this.state.deliveryLocations)
        console.log(this.state.products)
        console.log(Number(productDelivery.deliveryLocationId))
        console.log(Number(productDelivery.productId))
        console.log(productDelivery)
        console.log(this.state.deliveryLocationChoosed)
        console.log(this.state.productChoosed)
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        const wholeNumberRegex = /^\d*$/
        //const dateRegex = /^(([1-9])|(0[1-9])|(1[0-2]))\/(([1-9])|(0[1-9])|([12][0-9])|(3[01]))\/((19|20)\d{2})$/
        const decimalRegex = /^\d*\.?\d*$/
        if (name === "expirationDate") {
            this.setState({ expirationDate: value })
            // if (dateRegex.test(value)) {
            //   const [day, month, year] = value.split("-").reverse();
            //   const formattedDate = `${month}/${day}/${year}`;
            //   this.setState({ expirationDate: formattedDate });
            // }
        }
        if (name === "quantityDelivered") {
            if (wholeNumberRegex.test(value)) {
                this.setState({ quantityDelivered: value })
            }
        }
        if (name === "quantityReturned") {
            if (wholeNumberRegex.test(value)) {
                this.setState({ quantityReturned: value })
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
            try {
                const { productDeliveryId, deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, quantityReturned, soldPrice } = this.state
                //console.log(quantityReturned)
                let qReturnedValue: number | null
                if (quantityReturned === "") {
                    qReturnedValue = null
                } else {
                    qReturnedValue = +quantityReturned
                }

                const productDeliveryToEdit: IProductDeliveryData = {
                    id: productDeliveryId,
                    deliveryLocationId: deliveryLocationChoosed!.id,
                    productId: productChoosed!.id,
                    expirationDate,
                    quantityDelivered: +quantityDelivered,
                    quantityReturned: qReturnedValue,
                    soldPrice: +soldPrice,
                }
                //console.log(productDeliveryToAdd)
                const response = await ProductDeliveryService.updateProductDelivery(productDeliveryId, productDeliveryToEdit)
                if (response.status === 200) {
                    this.setState({
                        productDeliveryEdited: true
                    })
                }

            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, soldPrice, deliveryLocations } = this.state
        // console.log(deliveryLocationChoosed)
        // console.log(productChoosed)
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
        const { deliveryLocationChoosed, productChoosed, expirationDate, quantityDelivered, quantityReturned, soldPrice, message, productDeliveryEdited, openDeliveryLocations, openProducts, products, deliveryLocations } = this.state

        if (productDeliveryEdited) {
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
                                <b>Editar Entrega de Producto</b>
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
                                // loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Ubicacion de Entrega"

                                        value = {deliveryLocationChoosed?.name}
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
                                id="products"
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

                            <TextField id="quantityDelivered" variant="outlined" margin="normal" required fullWidth
                                label="Cantidad Entregada" name="quantityDelivered" value={quantityDelivered} onChange={this.handleOnChange} />

                            <TextField id="quantityReturned" variant="outlined" margin="normal" required fullWidth
                                label="Cantidad Devuelta" name="quantityReturned" value={quantityReturned} onChange={this.handleOnChange} />

                            <TextField id="soldPrice" variant="outlined" margin="normal" required fullWidth
                                label="Precio Venta" name="soldPrice" value={soldPrice} onChange={this.handleOnChange} />


                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Editar</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}

