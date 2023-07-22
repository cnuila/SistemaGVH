import React, { Component, SyntheticEvent } from 'react'
import { Box, Stack, Select, FormControl, InputLabel, MenuItem, SelectChangeEvent, Typography, Autocomplete, TextField } from '@mui/material'
import NavBar from './NavBar'
import "chart.js/auto";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Place } from '@mui/icons-material';
import IMessage from '../Utilities/Interfaces/IMessage'
import ProductService from '../Services/ProductService'
import IProductViewData from '../Utilities/Interfaces/IProductViewData'
import DeliveryZoneService from '../Services/DeliveryZoneService'
import IDeliveryZoneData from '../Utilities/Interfaces/IDeliveryZoneData'
import DeliveryLocationService from '../Services/DeliveryLocationService'
import IDeliveryLocationViewData from '../Utilities/Interfaces/IDeliveryLocationViewData'
import DashboardService from '../Services/DashboardService';
import IProductsByLocationData from '../Utilities/Interfaces/IProductsByLocationData';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export const verticalGraphOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Productos por Mes',
        },
    },
};
export const pieGraphOptions = {
    responsive: true
};
export const horizontalGraphOptions = {
    indexAxis: 'y' as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true
};

type Props = {}

type State = {
    year: string,
    month: string,
    product: string,
    selectedProduct: string,
    selectedPlace: IDeliveryLocationViewData | null,
    message: IMessage,
    verticalBarData: ChartData<"bar">,
    pieData: ChartData<"pie">,
    horizontalBarData: ChartData<"bar">,

    products: Array<IProductViewData>,
    productsByLocation: Array<IProductsByLocationData>,
    deliveryZones: Array<IDeliveryZoneData>,
    deliveryLocations: Array<IDeliveryLocationViewData>,
}

export default class Home extends Component<Props, State> {
    products: Array<IProductViewData> = []
    deliveryZones: Array<IDeliveryZoneData> = []
    labels: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    places: { name: string, value: number }[] = [{ name: 'Tatumbla', value: 20 }, { name: 'Loarque', value: 15 }, { name: 'Comayagua', value: 10 }, { name: 'Catacamas', value: 5 }, { name: 'Tonelitos', value: 1 }];
    state: State = {
        year: "",
        month: "",
        product: "",
        selectedPlace: null,
        selectedProduct: "",
        products: [],
        productsByLocation: [],
        deliveryZones: [],
        deliveryLocations: [],
        message: {
            show: false,
            text: "",
            type: "success"
        },
        verticalBarData: {
            labels: this.labels,
            datasets: [
                {
                    label: 'Entregados',
                    data: this.labels.map(() => 50),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: 'Devueltos',
                    data: this.labels.map(() => 20),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ]
        },
        pieData: {
            labels: this.products.map(p => p.description),
            datasets: [
                {
                    label: 'Cantidad',
                    data: this.products.map(p => p.cost),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        },
        horizontalBarData: {
            labels: this.deliveryZones.map(z => z.name),
            datasets: [
                {
                    label: '# Ventas',
                    data: this.places.map(p => p.value),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                }
            ]
        }
    }

    /*handleDeliveryLocationChange = (event: SyntheticEvent<Element, Event>, value: IDeliveryLocationData | null) => {
        if (value !== null) {
            this.setState({ deliveryLocationChoosed: value });
        } else {
            this.setState({ deliveryLocationChoosed: null });
        }
    }*/

    async componentDidMount() {
        const products = (await ProductService.getAll()).data
        const deliveryZones = (await DeliveryZoneService.getAll()).data
        const deliveryLocations = (await DeliveryLocationService.getAll()).data

        console.log(deliveryLocations)
        this.setState({
            products,
            deliveryZones,
            deliveryLocations,
            pieData: {
                labels: products.map(p => p.description),
                datasets: [
                    {
                        label: 'Cantidad',
                        data: products.map(p => p.cost),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    }
                ]
            },
            verticalBarData: {
                labels: this.labels,
                datasets: [
                    {
                        label: 'Entregados',
                        data: this.labels.map(() => 50),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                        label: 'Devueltos',
                        data: this.labels.map(() => 20),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ]
            },
            horizontalBarData: {
                labels: deliveryZones.map(z => z.name),
                datasets: [
                    {
                        label: '# Ventas',
                        data: this.places.map(p => p.value),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }
                ]
            },
        })
    }

    handleYearChange = (event: SelectChangeEvent) => {
        this.setState({
            year: event.target.value
        })
    }
    handleMonthChange = (event: SelectChangeEvent) => {
        this.setState({
            month: event.target.value
        })
    }
    handleProductChange = (event: SelectChangeEvent) => {
        this.setState({
            product: event.target.value
        })
    }

    handlePPPChange = async (event: SyntheticEvent<Element, Event>, value: IDeliveryLocationViewData | null) => {
        if (value !== null) {
            this.setState({ selectedPlace: value });
            try {
                const response = await DashboardService.getProductsByLocation(value!.id!)
                console.log(response.status)
                if (response.status === 200) {
                    const productsByLocation = response.data
                    this.setState({
                        pieData: {
                            labels: productsByLocation.map(p => p.productName),
                            datasets: [
                                {
                                    label: 'Cantidad',
                                    data: productsByLocation.map(p => p.quantity),
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                    ],
                                    borderWidth: 1,
                                }
                            ]
                        },
                    })
                }
            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        } else {
            this.setState({ selectedPlace: null });
        }
    }

    handleEPPChange = (event: SelectChangeEvent) => {
        this.setState({
            selectedProduct: event.target.value
        })
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
    render() {
        const { year, month, product, verticalBarData, pieData, horizontalBarData, selectedPlace, selectedProduct, products, deliveryZones, deliveryLocations } = this.state
        return (
            <React.Fragment>
                <NavBar />
                <Box>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={20} sx={{ p: 8 }}>











                        <Box sx={{ width: 300, height: 300 }}>
                            <Stack justifyContent="center" alignItems="center">
                                <Typography variant="h6" sx={{ color: "#464555" }}>
                                    <b>Productos Por Lugar</b>
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 240 }}>
                                    <Autocomplete
                                        id="location"
                                        sx={{ marginTop: 2 }}
                                        isOptionEqualToValue={(option: IDeliveryLocationViewData, value: IDeliveryLocationViewData) => option.name === value.name}
                                        getOptionLabel={(option: IDeliveryLocationViewData) => option.name}
                                        options={deliveryLocations}
                                        onChange={this.handlePPPChange}
                                        value={selectedPlace}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Lugar"
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



                                </FormControl>
                                <Box justifyContent="center" alignItems="center" sx={{ width: 240, height: 240, }}>
                                    <Pie options={pieGraphOptions} data={pieData} />
                                </Box>
                            </Stack>
                        </Box>










                        <Box sx={{ width: 300, height: 300 }}>
                            <Stack justifyContent="center" alignItems="center">
                                <Typography variant="h6" sx={{ color: "#464555" }}>
                                    <b>Venta por Zona</b>
                                </Typography>
                                <Box justifyContent="center" alignItems="center" sx={{ width: 400, height: 400, pt: 5 }}>
                                    <Bar options={horizontalGraphOptions} data={horizontalBarData} />
                                </Box>
                            </Stack>
                        </Box>









                        <Box sx={{ width: 350, height: 300 }}>
                            <Stack justifyContent="center" alignItems="center">
                                <Typography variant="h6" sx={{ color: "#464555" }}>
                                    <b>Tiempo de Caducidad por Producto</b>
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 240 }}>
                                    <InputLabel id="dropdown-ExpiryXProduct">Producto</InputLabel>
                                    <Select labelId="dropdown-ExpiryXProduct" id="dropdown-ExpiryXProduct" value={selectedProduct} label="Product" onChange={this.handleEPPChange}>
                                        {products.map(({ description }, index) => (
                                            <MenuItem key={index} value={index}>
                                                {description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography variant="h1" sx={{ color: "#464555", p: 3 }}>
                                    <b>5</b>
                                </Typography>
                            </Stack>
                        </Box>











                    </Stack >
                    <Box>
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={20}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="dropdown-anio">Año</InputLabel>
                                <Select labelId="dropdown-anio" id="dropdown-anio" value={year} label="Año" onChange={this.handleYearChange}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>2023</MenuItem>
                                    <MenuItem value={2}>2024</MenuItem>
                                    <MenuItem value={3}>2025</MenuItem>
                                    <MenuItem value={4}>2026</MenuItem>
                                    <MenuItem value={5}>2027</MenuItem>
                                    <MenuItem value={6}>2028</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="dropdown-mes">Mes</InputLabel>
                                <Select labelId="dropdown-mes" id="dropdown-mes" value={month} label="Mes" onChange={this.handleMonthChange}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Enero</MenuItem>
                                    <MenuItem value={2}>Febrero</MenuItem>
                                    <MenuItem value={3}>Marzo</MenuItem>
                                    <MenuItem value={4}>Abril</MenuItem>
                                    <MenuItem value={5}>Mayo</MenuItem>
                                    <MenuItem value={6}>Junio</MenuItem>
                                    <MenuItem value={7}>Julio</MenuItem>
                                    <MenuItem value={8}>Agosto</MenuItem>
                                    <MenuItem value={9}>Septiembre</MenuItem>
                                    <MenuItem value={10}>Octubre</MenuItem>
                                    <MenuItem value={11}>Noviembre</MenuItem>
                                    <MenuItem value={12}>Diciembre</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="dropdown-producto">Producto</InputLabel>
                                <Select labelId="dropdown-producto" id="dropdown-producto" value={product} label="Producto" onChange={this.handleProductChange}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>X</MenuItem>
                                    <MenuItem value={2}>Y</MenuItem>
                                    <MenuItem value={3}>Z</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={20}>
                            <Box justifyContent="center" alignItems="center" sx={{ width: 800, height: 400, }}>
                                <Bar options={verticalGraphOptions} data={verticalBarData} />
                            </Box>
                        </Stack>
                    </Box>
                </Box >
            </React.Fragment >
        )
    }
}