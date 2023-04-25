import React, { Component, SyntheticEvent } from 'react'
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import NavBar from '../NavBar'
import IMessage from '../../Utilities/Interfaces/IMessage'
import IProductData from '../../Utilities/Interfaces/IProductData'
import ProductService from '../../Services/ProductService'

type Props = { } 

type State = {
    code: string,
    description: string,
    cost: string,
    sellingPrice: string,
    quantity: string,
    message: IMessage,
    productCreated: boolean
}

export default class AddProduct extends Component<Props, State>{

    state: State = {
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
        productCreated: false
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
            if (decimalRegex.test(value)){
                this.setState({ cost: value })
            }            
        }
        if (name === "sellingPrice") {
            if (decimalRegex.test(value)){
                this.setState({ sellingPrice: value })
            }                 
        }
        const wholeNumberRegex = /^\d*$/
        if (name === "quantity") {
            if (wholeNumberRegex.test(value)){
                this.setState({ quantity: value })
            }            
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { code, description, cost, sellingPrice, quantity } = this.state
                const productToAdd: IProductData = {
                    id: null,
                    code,
                    description,
                    cost: +cost,
                    sellingPrice: +sellingPrice,
                    quantity: +quantity
                }

                const response = await ProductService.addProduct(productToAdd)
                if (response.status === 201) {
                    this.setState({
                        productCreated: true
                    })
                }

            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validations = () => {
        const { code, description, cost, sellingPrice, quantity } = this.state
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
        const { code, description, cost, sellingPrice, quantity, message, productCreated } = this.state

        if(productCreated){
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
                                <b>Crear Producto</b>
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

                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1, bgcolor: "#002366", width: 150, alignSelf: "end" }}>Crear</Button>
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}