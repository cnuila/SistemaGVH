import React, { Component, SyntheticEvent } from 'react'
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import IMessage from '../../Utilities/Interfaces/IMessage'
import NavBar from '../NavBar'
import IProductData from '../../Utilities/Interfaces/IProductData'
import ProductService from '../../Services/ProductService'
import Autocomplete from '@mui/material/Autocomplete';
import IProviderData from '../../Utilities/Interfaces/IProviderData'
import ProviderService from '../../Services/ProviderService'

type Props = {

}

type State = {
    productId: number,
    code: string,
    description: string,
    cost: string,
    sellingPrice: string,
    quantity: string,
    message: IMessage,
    productEdited: boolean,
    providers: IProviderData[],
    selectedProvider: IProviderData | null,
}

export default class EditProduct extends Component<Props, State> {

    state: State = {
        productId: +document.location.pathname.split("/")[2],
        code: "",
        description: "",
        cost: "0",
        sellingPrice: "0",
        quantity: "0",
        message: {
            show: false,
            text: "",
            type: "success"
        },
        productEdited: false,
        providers: [],
        selectedProvider: null,
    }

    async componentDidMount() {
        const { productId } = this.state
        const product = (await ProductService.getById(productId)).data
        const providers = (await ProviderService.getAll()).data                    
        this.setState({
            code: product.code,
            description: product.description,
            cost: product.cost.toString(),
            sellingPrice: product.sellingPrice.toString(),
            quantity: product.quantity.toString(),
            providers,
            selectedProvider: providers.find((provider) => provider.id === product.providerId) || null
        })
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "code") {
            this.setState({ code: value })
        }
        if (name === "description") {
            this.setState({ description: value })
        }

        const decimalRegex = /^\d*\.?\d*$/
        if (name === "cost") {
            if (decimalRegex.test(value)) {
                this.setState({ cost: value })
            }
        }
        if (name === "sellingPrice") {
            if (decimalRegex.test(value)) {
                this.setState({ sellingPrice: value })
            }
        }
        const wholeNumberRegex = /^\d*$/
        if (name === "quantity") {
            if (wholeNumberRegex.test(value)) {
                this.setState({ quantity: value })
            }
        }
    }

    handleProviderChange = (event: SyntheticEvent<Element, Event>, value: IProviderData | null) => {
        if (value !== null) {
            this.setState({ selectedProvider: value });
        } else {
            this.setState({ selectedProvider: null });
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { productId, code, description, cost, sellingPrice, quantity, selectedProvider } = this.state
                const productToEdit: IProductData = {
                    id: productId,
                    code,
                    description,
                    cost: +cost,
                    sellingPrice: +sellingPrice,
                    quantity: +quantity,
                    providerId : selectedProvider!.id
                }

                const response = await ProductService.updateProduct(productId, productToEdit)
                if (response.status === 200) {
                    this.setState({
                        productEdited: true
                    })
                }

            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { code, description, cost, sellingPrice, quantity, selectedProvider } = this.state
        if (code === "") {
            this.prepareMessage("Debes ingresar un Código", true);
            return false
        }

        if (description === "") {
            this.prepareMessage("Debes ingresar una Descripción", true);
            return false
        }

        if (cost === "" || +cost === 0) {
            this.prepareMessage("Debes ingresar un Costo distinto a 0", true);
            return false
        }

        if (sellingPrice === "" || +sellingPrice === 0) {
            this.prepareMessage("Debes ingresar un Precio de Venta distinto a 0", true);
            return false
        }

        if (quantity === "") {
            this.prepareMessage("Debes ingresar una Cantidad", true);
            return false
        }

        if (selectedProvider == null) {
            this.prepareMessage("Debes seleccionar un Proveedor", true);
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
        const { code, description, cost, sellingPrice, quantity, message, productEdited, providers, selectedProvider } = this.state

        if (productEdited) {
            return (<Navigate to={"/productos"} replace />)
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
                                <b>Editar Producto</b>
                            </Typography>

                        </Box>
                        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} noValidate onSubmit={this.handleOnSubmit}>
                            <TextField id="code" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Código" name="code" value={code} onChange={this.handleOnChange}
                            />
                            <TextField id="description" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Descripción" name="description" value={description} onChange={this.handleOnChange} />

                            <TextField id="cost" type="text" variant="outlined" margin="normal" required fullWidth
                                label="Costo" name="cost" value={cost} onChange={this.handleOnChange} />

                            <TextField id="sellingPrice" type='text' variant="outlined" margin="normal" required fullWidth
                                label="Precio de Venta" name="sellingPrice" value={sellingPrice} onChange={this.handleOnChange} />

                            <TextField id="quantity" type="text" variant="outlined" margin="normal" required fullWidth
                                label="Cantidad" name="quantity" value={quantity} onChange={this.handleOnChange} />

                            <Autocomplete
                                id="provider"
                                sx={{ marginTop: 2 }}
                                isOptionEqualToValue={(option: IProviderData, value: IProviderData) => option.name === value.name}
                                getOptionLabel={(option: IProviderData) => option.name}
                                options={providers}
                                onChange={this.handleProviderChange}
                                value={selectedProvider}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nombre del Proveedor"
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

                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Editar</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}