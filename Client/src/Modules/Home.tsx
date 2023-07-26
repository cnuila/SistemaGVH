import React, { Component, SyntheticEvent } from 'react'
import { Box, Stack, FormControl, SelectChangeEvent, Typography, Autocomplete, TextField } from '@mui/material'
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
import IMessage from '../Utilities/Interfaces/IMessage'
import ProductService from '../Services/ProductService'
import IProductViewData from '../Utilities/Interfaces/IProductViewData'
import DeliveryLocationService from '../Services/DeliveryLocationService'
import IDeliveryLocationViewData from '../Utilities/Interfaces/IDeliveryLocationViewData'
import DashboardService from '../Services/DashboardService';
import IProductsByLocationData from '../Utilities/Interfaces/IProductsByLocationData';
import ISellsByZoneData from '../Utilities/Interfaces/ISellsByZoneData';
import Swal from 'sweetalert2'
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import IExpiredProductsData from '../Utilities/Interfaces/IExpiredProductsData';

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
    selectedYear: string | null,
    month: string,
    product: string,
    selectedProduct: IProductViewData | null,
    selectedPlace: IDeliveryLocationViewData | null,
    message: IMessage,
    verticalBarData: ChartData<"bar">,
    pieData: ChartData<"pie">,
    horizontalBarData: ChartData<"bar">,
    columnHeadersExpired: Array<GridColDef<IExpiredProductsData>>,
    expirationAVG: number,
    expiredProducts: Array<IExpiredProductsData>,
    products: Array<IProductViewData>,
    productsByLocation: Array<IProductsByLocationData>,
    deliveryZones: Array<ISellsByZoneData>,
    deliveryLocations: Array<IDeliveryLocationViewData>,
}

export default class Home extends Component<Props, State> {
    labels: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    state: State = {
        selectedYear: new Date().getFullYear().toString(),
        month: "",
        product: "",
        columnHeadersExpired: [
            { field: "name", headerName: "Nombre", headerAlign: "center", align: "center", width: 200, type: "string" },
            { field: "remainingDays", headerName: "Dias Restantes", headerAlign: "center", align: "center", width: 120, type: "number" },
            { field: "location", headerName: "Lugar", headerAlign: "center", align: "center", width: 200, type: "string" },
            { field: "zone", headerName: "Zona", headerAlign: "center", align: "center", width: 200, type: "string" },
        ],
        selectedPlace: null,
        expirationAVG: 0,
        selectedProduct: null,
        products: [],
        productsByLocation: [],
        deliveryZones: [],
        deliveryLocations: [],
        expiredProducts: [],
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
                    data: [],
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: 'Devueltos',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ]
        },
        pieData: {
            labels: ['Producto'],
            datasets: [
                {
                    label: 'Cantidad',
                    data: [100],
                    backgroundColor: ['rgba(53, 162, 235, 0.5)'],
                    borderColor: [],
                    borderWidth: 1,
                }
            ]
        },
        horizontalBarData: {
            labels: [],
            datasets: [
                {
                    label: '# Ventas',
                    data: [],
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
        const deliveryLocations = (await DeliveryLocationService.getAll()).data
        const deliveryZones = (await DashboardService.getSellsByZone()).data
        const monthlyDeliveries = (await DashboardService.getMonthlyDeliveries(new Date().getFullYear().toString())).data
        let expiredProducts = (await DashboardService.getExpiredProducts()).data
        //convierte los segundos a dias
        expiredProducts = expiredProducts.map(p => {
            return { ...p, remainingDays: Math.floor(p.remainingDays / (24 * 60 * 60)) };
        })
        console.log(expiredProducts)
        this.setState({
            products,
            deliveryZones,
            deliveryLocations,
            expiredProducts,
            verticalBarData: {
                labels: this.labels,
                datasets: [
                    {
                        label: 'Entregados',
                        data: Array.from({ length: 12 }, (_, index) => {
                            const matchingDelivery = monthlyDeliveries.find(d => d.month === index + 1);
                            return matchingDelivery ? matchingDelivery.totalDelivered : 0;
                        }),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                        label: 'Devueltos',
                        data: Array.from({ length: 12 }, (_, index) => {
                            const matchingDelivery = monthlyDeliveries.find(d => d.month === index + 1);
                            return matchingDelivery ? matchingDelivery.totalReturned : 0;
                        }),
                        //data: monthlyDeliveries.map(d => d.totalReturned),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ]
            },
            horizontalBarData: {
                labels: deliveryZones.map(z => z.name),
                datasets: [
                    {
                        label: '# Ventas',
                        data: deliveryZones.map(z => z.deliveries),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }
                ]
            },
        })
    }

    handleYearChange = async (event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value !== null) {
            this.setState({ selectedYear: value });
            try {
                const response = await DashboardService.getMonthlyDeliveries(value!)
                if (response.status === 200) {
                    const monthlyDeliveries = response.data
                    console.log(monthlyDeliveries)
                    this.setState({
                        verticalBarData: {
                            labels: this.labels,
                            datasets: [
                                {
                                    label: 'Entregados',
                                    data: monthlyDeliveries.map(m => m.totalDelivered),
                                    //data: monthlyDeliveries.map(d => d.totalDelivered),
                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                },
                                {
                                    label: 'Devueltos',
                                    data: monthlyDeliveries.map(m => m.totalReturned),
                                    //data: monthlyDeliveries.map(d => d.totalReturned),
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                            ]
                        },
                    })
                }
            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        } else {
            this.setState({ selectedYear: null });
        }
    }

    fireAlert = () => {
        Swal.fire({
            title: 'Productos Por Vencer',
            icon: 'info',
            text: 'Los siguientes productos estan por vencer:',
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

    handleEPPChange = async (event: SyntheticEvent<Element, Event>, value: IProductViewData | null) => {
        if (value !== null) {
            this.setState({ selectedProduct: value });
            try {
                const response = await DashboardService.getExpirationByProduct(value!.id!)
                console.log(response.data)
                if (response.status === 200) {
                    const expirationAVG = response.data
                    this.setState({
                        expirationAVG,
                    })
                }
            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        } else {
            this.setState({ selectedProduct: null });
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
    render() {
        const { selectedYear, month, product, verticalBarData, pieData, horizontalBarData, selectedPlace, selectedProduct, products, deliveryLocations, expirationAVG, columnHeadersExpired, expiredProducts } = this.state
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
                                    <b>Comparacion</b>
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                                <Stack direction="row" justifyContent="center" alignItems="center" spacing={20}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <Autocomplete
                                            id="location"
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
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <Autocomplete
                                            id="location"
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
                                </Stack>
                                <Stack direction="row" justifyContent="center" alignItems="center" spacing={20}>
                                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                                        <Autocomplete
                                            id="location"
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
                                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                                        <Autocomplete
                                            id="location"
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
                                </Stack>

                                <Box justifyContent="center" alignItems="center" sx={{ width: 240, height: 240, }}>
                                    <Pie options={pieGraphOptions} data={pieData} />
                                </Box>
                            </Stack>
                        </Box>









                        <Box sx={{ width: 350, height: 300 }}>
                            <Stack justifyContent="center" alignItems="center">
                                <Typography variant="h6" sx={{ color: "#464555" }}>
                                    <b>Tiempo de Caducidad por Producto</b>
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 240 }}>
                                    <Autocomplete
                                        id="product"
                                        sx={{ marginTop: 2 }}
                                        isOptionEqualToValue={(option: IProductViewData, value: IProductViewData) => option.description === value.description}
                                        getOptionLabel={(option: IProductViewData) => option.description}
                                        options={products}
                                        onChange={this.handleEPPChange}
                                        value={selectedProduct}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Producto"
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
                                <Box justifyContent="center" alignItems="center">
                                    <Typography textAlign="center" variant="h1" sx={{ color: "#464555", p: 3, width: 500 }}>
                                        <b>{expirationAVG} días</b>
                                    </Typography>
                                </Box>

                            </Stack>
                        </Box>











                    </Stack >
                    <Box>
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={5} sx={{ mb: 8 }}>
                            <Box justifyContent="center" alignItems="center" sx={{ width: 900, height: 500 }}>
                                <Stack direction="row" justifyContent="left" alignItems="center" spacing={5}>

                                    <FormControl sx={{ m: 1, minWidth: 240 }}>
                                        <Autocomplete
                                            id="year"
                                            sx={{ marginTop: 2 }}
                                            isOptionEqualToValue={(option: string, value: string) => option === value}
                                            options={["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]}
                                            onChange={this.handleYearChange}
                                            value={selectedYear}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Año"
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
                                    <Typography variant="h6" sx={{ color: "#464555", mt: 5, px: 8 }}>
                                        <b>Productos Por Mes</b>
                                    </Typography>
                                </Stack>
                                <Bar options={verticalGraphOptions} data={verticalBarData} />
                            </Box>

                            <Stack justifyContent="center" alignItems="center" spacing={5}>
                                <Typography variant="h6" sx={{ color: "#464555", mt: 5 }}>
                                    <b>Productos Por Vencer</b>
                                </Typography>
                                <Box sx={{ height: 510, width: '103%', pb: 3 }}>
                                    <DataGrid
                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                        sx={{ boxShadow: 3 }}
                                        columns={columnHeadersExpired}
                                        rows={expiredProducts}
                                    />
                                </Box>
                            </Stack>

                        </Stack>
                    </Box>


                </Box >
            </React.Fragment >
        )
    }
}