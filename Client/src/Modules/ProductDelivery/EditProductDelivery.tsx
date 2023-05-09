import React, { Component, SyntheticEvent } from 'react'
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import IMessage from '../../Utilities/Interfaces/IMessage'
import NavBar from '../NavBar'
import IProductDeliveryData from '../../Utilities/Interfaces/IProductDeliveryData'
import ProductDeliveryService from '../../Services/ProductDeliveryService'

type Props = {

}

type State = {
    productDeliveryId: number,
    deliveryLocationId__name: string,
    productId__description: string,
    expirationDate: string,
    quantityDelivered: string,
    quantityReturned: string,
    soldPrice: string,
    message: IMessage,
    productDeliveryEdited: boolean
}

export default class EditProductDelivery extends Component<Props, State> {
    state: State = {
        productDeliveryId: +document.location.pathname.split("/")[2],
        deliveryLocationId__name: "",
        productId__description: "",
        expirationDate: "",
        quantityDelivered: "0",
        quantityReturned: "",
        soldPrice: "0",
        message: {
            show: false,
            text: "",
            type: "success"
        },
        productDeliveryEdited: false
    }

    async componentDidMount() {
        const { productDeliveryId } = this.state
        const productDelivery = (await ProductDeliveryService.getById(productDeliveryId)).data
        if(productDelivery.quantityReturned === null){
            this.setState({quantityReturned: ""})
        }else{
            this.setState({quantityReturned: productDelivery.quantityReturned.toString()})
        }
        this.setState({
            deliveryLocationId__name: productDelivery.deliveryLocationId__name,
            productId__description: productDelivery.productId__description,
            expirationDate: productDelivery.expirationDate.toString(),
            quantityDelivered: productDelivery.quantityDelivered.toString(),
            soldPrice: productDelivery.soldPrice.toString()
        })
        
        //console.log(productDelivery)
    }

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        const wholeNumberRegex = /^\d*$/
        //const dateRegex = /^(([1-9])|(0[1-9])|(1[0-2]))\/(([1-9])|(0[1-9])|([12][0-9])|(3[01]))\/((19|20)\d{2})$/
        const decimalRegex = /^\d*\.?\d*$/

        if (name === "deliveryLocationId__name") {
            this.setState({ deliveryLocationId__name: value })
        }
        if (name === "productId__description") {
            this.setState({ productId__description: value })
        }            
        if (name === "expirationDate") {
            this.setState({ expirationDate: value })
            // if (dateRegex.test(value)) {
            //   const [day, month, year] = value.split("-").reverse();
            //   const formattedDate = `${month}/${day}/${year}`;
            //   this.setState({ expirationDate: formattedDate });
            // }
        }
        if (name === "quantityDelivered") {
            if (wholeNumberRegex.test(value)){
                this.setState({ quantityDelivered: value })
            }
        } 
        if (name === "quantityReturned") {
            if (wholeNumberRegex.test(value)){
                this.setState({ quantityReturned: value })
            }
        }
        if (name === "soldPrice") {
            if (decimalRegex.test(value)){
                this.setState({ soldPrice: value })
            }                 
        }
    }

    handleOnSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.validations()) {
            try {
                const { productDeliveryId, deliveryLocationId__name, productId__description, expirationDate, quantityDelivered, quantityReturned, soldPrice } = this.state
                //console.log(quantityReturned)
                let qReturnedValue: number | null 
                if(quantityReturned === ""){    
                    qReturnedValue = null
                }else{
                    qReturnedValue = +quantityReturned
                }
                
                const productDeliveryToEdit: IProductDeliveryData = {
                    id: productDeliveryId,
                    deliveryLocationId__name,
                    productId__description,
                    expirationDate,
                    quantityDelivered: +quantityDelivered,
                    quantityReturned: qReturnedValue,
                    soldPrice: +soldPrice,
                }
                //console.log(productDeliveryToAdd)
                const response = await ProductDeliveryService.updateProductDelivery(productDeliveryId,productDeliveryToEdit)
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
        const { deliveryLocationId__name, productId__description, expirationDate, quantityDelivered, soldPrice } = this.state
        if (deliveryLocationId__name === "") {
            this.prepareMessage("Debes ingresar un Nombre de Ubicacion", true);
            return false
        }
        if (productId__description === "") {
            this.prepareMessage("Debes ingresar una descripcion de producto", true);
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
        const { deliveryLocationId__name, productId__description, expirationDate, quantityDelivered, quantityReturned, soldPrice, message, productDeliveryEdited } = this.state

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

                            <TextField id="deliveryLocationId__name" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Nombre Ubicacion" name="deliveryLocationId__name" value={deliveryLocationId__name} onChange={this.handleOnChange}/>

                            <TextField id="productId__description" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Nombre Producto" name="productId__description" value={productId__description} onChange={this.handleOnChange} />

                            <TextField id="expirationDate" variant="outlined" margin="normal" required fullWidth type="text"
                                label="Fecha Expiracion" name="expirationDate" value={expirationDate} onChange={this.handleOnChange} />

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

