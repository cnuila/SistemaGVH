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
    selectedComparisonLocation: IDeliveryLocationViewData | null,
    selectedComparisonMonth1: string | null,
    selectedComparisonMonth2: string | null,
    selectedComparisonYear1: string | null,
    selectedComparisonYear2: string | null,
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
    deliveryLocations: Array<IDeliveryLocationViewData>,
    pieDataComparison: ChartData<"pie">,
}

export default class Home extends Component<Props, State> {
    months: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    state: State = {
        selectedYear: new Date().getFullYear().toString(),
        selectedComparisonLocation: null,
        selectedComparisonMonth1: null,
        selectedComparisonMonth2: null,
        selectedComparisonYear1: null,
        selectedComparisonYear2: null,
        month: "",
        product: "",
        columnHeadersExpired: [
            { field: "productName", headerName: "Nombre", headerAlign: "center", align: "center", width: 200, type: "string" },
            { field: "remainingDays", headerName: "Dias Restantes", headerAlign: "center", align: "center", width: 120, type: "number" },
            { field: "deliveryLocation", headerName: "Lugar", headerAlign: "center", align: "center", width: 200, type: "string" },
            { field: "deliveryZone", headerName: "Zona", headerAlign: "center", align: "center", width: 200, type: "string" },
        ],
        selectedPlace: null,
        expirationAVG: 0,
        selectedProduct: null,
        products: [],
        productsByLocation: [],
        deliveryLocations: [],
        expiredProducts: [],
        message: {
            show: false,
            text: "",
            type: "success"
        },
        verticalBarData: {
            labels: this.months,
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
            labels: ['Empty'],
            datasets: [
                {
                    label: 'Cantidad',
                    data: [1],
                    backgroundColor: ['rgba(255, 255, 255, 1)'],
                    borderColor: ['rgba(0, 0, 0, 1)'],
                    borderWidth: 1,
                }
            ]
        },
        pieDataComparison: {
            labels: ['Empty'],
            datasets: [
                {
                    label: 'Cantidad',
                    data: [1],
                    backgroundColor: ['rgba(255, 255, 255, 1)'],
                    borderColor: ['rgba(0, 0, 0, 1)'],
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

    async componentDidMount() {
        const products = (await ProductService.getAll()).data
        const deliveryLocations = (await DeliveryLocationService.getAll()).data
        const monthlyDeliveries = (await DashboardService.getMonthlyDeliveries(new Date().getFullYear().toString())).data
        const expiredProducts = (await DashboardService.getExpiredProducts()).data
        this.setState({
            products,
            deliveryLocations,
            expiredProducts,
            verticalBarData: {
                labels: this.months,
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
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        const { selectedPlace, selectedComparisonMonth1, selectedComparisonMonth2, selectedComparisonYear1, selectedComparisonYear2 } = this.state
        if (prevState.selectedPlace != selectedPlace) {
            this.validateComparisonPieGraphCall1()
            this.validateComparisonPieGraphCall2()
        }
        if (prevState.selectedComparisonMonth1 != selectedComparisonMonth1) {
            this.validateComparisonPieGraphCall1()
        }
        if (prevState.selectedComparisonMonth2 != selectedComparisonMonth2) {
            this.validateComparisonPieGraphCall2()
        }
        if (prevState.selectedComparisonYear1 != selectedComparisonYear1) {
            this.validateComparisonPieGraphCall1()
        }
        if (prevState.selectedComparisonYear2 != selectedComparisonYear2) {
            this.validateComparisonPieGraphCall2()
        }
    }

    handleYearChange = async (event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value !== null) {
            this.setState({ selectedYear: value });
            try {
                const response = await DashboardService.getMonthlyDeliveries(value!)
                if (response.status === 200) {
                    const monthlyDeliveries = response.data
                    this.setState({
                        verticalBarData: {
                            labels: this.months,
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

    handlePPPChange = async (event: SyntheticEvent<Element, Event>, value: IDeliveryLocationViewData | null) => {
        if (value !== null) {
            this.setState({ selectedPlace: value });
        } else {
            this.setState({ selectedPlace: null });
        }
    }

    handleCM1Change = async (event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value !== null) {
            this.setState({ selectedComparisonMonth1: value });
        } else {
            this.setState({ selectedComparisonMonth1: null });
        }
    }

    handleCM2Change = async (event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value !== null) {
            this.setState({ selectedComparisonMonth2: value });
        } else {
            this.setState({ selectedComparisonMonth2: null });
        }
    }

    handleCY1Change = async (event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value !== null) {
            this.setState({ selectedComparisonYear1: value });
        } else {
            this.setState({ selectedComparisonYear1: null });
        }
    }

    handleCY2Change = async (event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value !== null) {
            this.setState({ selectedComparisonYear2: value });
        } else {
            this.setState({ selectedComparisonYear2: null });
        }
    }

    validateComparisonPieGraphCall1 = async () => {
        if (this.state.selectedPlace != null && this.state.selectedComparisonMonth1 != null && this.state.selectedComparisonYear1 != null) {
            const monthIndex = this.months.findIndex((month) => month === this.state.selectedComparisonMonth1) + 1;
            try {
                const response = await DashboardService.getProductsByLocation(this.state.selectedPlace.id!, monthIndex, this.state.selectedComparisonYear1)
                const productsByLocation = response.data
                if (response.status === 200 && productsByLocation.length != 0) {
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
                } else {
                    this.setState({
                        pieData: {
                            labels: ['Empty'],
                            datasets: [
                                {
                                    label: 'Cantidad',
                                    data: [1],
                                    backgroundColor: ['rgba(255, 255, 255, 1)'],
                                    borderColor: ['rgba(0, 0, 0, 1)'],
                                    borderWidth: 1,
                                }
                            ]
                        }
                    })
                }
            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }

    validateComparisonPieGraphCall2 = async () => {
        if (this.state.selectedPlace != null && this.state.selectedComparisonMonth2 != null && this.state.selectedComparisonYear2 != null) {
            const monthIndex = this.months.findIndex((month) => month === this.state.selectedComparisonMonth2) + 1;
            try {
                const response = await DashboardService.getProductsByLocation(this.state.selectedPlace.id!, monthIndex, this.state.selectedComparisonYear2)
                const productsByLocation = response.data
                if (response.status === 200 && productsByLocation.length != 0) {
                    this.setState({
                        pieDataComparison: {
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
                } else {
                    this.setState({
                        pieDataComparison: {
                            labels: ['Empty'],
                            datasets: [
                                {
                                    label: 'Cantidad',
                                    data: [1],
                                    backgroundColor: ['rgba(255, 255, 255, 1)'],
                                    borderColor: ['rgba(0, 0, 0, 1)'],
                                    borderWidth: 1,
                                }
                            ]
                        }
                    })
                }
            } catch (error) {
                this.prepareMessage("Error desconocido, intenta de nuevo.", true)
            }
        }
    }


    handleEPPChange = async (event: SyntheticEvent<Element, Event>, value: IProductViewData | null) => {
        if (value !== null) {
            this.setState({ selectedProduct: value });
            try {
                const response = await DashboardService.getExpirationByProduct(value!.id!)
                if (response.status === 200) {
                    const expirationAVG = Math.round(response.data.ExpiryAVG)
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
        const { selectedYear, verticalBarData, pieData, selectedPlace, selectedProduct, products, deliveryLocations, expirationAVG, pieDataComparison, columnHeadersExpired, expiredProducts, selectedComparisonLocation, selectedComparisonMonth1, selectedComparisonMonth2, selectedComparisonYear1, selectedComparisonYear2 } = this.state
        return (
            <React.Fragment>
                <NavBar />
                <Box>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={20} sx={{ p: 8 }}>











                        <Box sx={{ width: 800, height: 300 }}>
                            <Stack justifyContent="center" alignItems='flex-start'>
                                <Typography variant="h6" sx={{ color: "#464555", ml: 2 }}>
                                    <b>Productos Por Lugar</b>
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 320, }}>
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
                                <Stack direction="row" justifyContent="center" alignItems="center" spacing={3}>
                                    <FormControl sx={{ m: 1, minWidth: 170 }}>
                                        <Autocomplete
                                            id="ComparisonMonth1"
                                            isOptionEqualToValue={(option: string, value: string) => option === value}
                                            options={this.months}
                                            onChange={this.handleCM1Change}
                                            value={selectedComparisonMonth1}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Mes"
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
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <Autocomplete
                                            id="comparisonYear1"
                                            isOptionEqualToValue={(option: string, value: string) => option === value}
                                            options={["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]}
                                            onChange={this.handleCY1Change}
                                            value={selectedComparisonYear1}
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
                                    <FormControl sx={{ m: 1, minWidth: 250, pl: 10 }}>
                                        <Autocomplete
                                            id="comparisonMonth2"
                                            isOptionEqualToValue={(option: string, value: string) => option === value}
                                            options={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']}
                                            onChange={this.handleCM2Change}
                                            value={selectedComparisonMonth2}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Mes"
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
                                    <FormControl sx={{ mb: 1, minWidth: 120 }}>
                                        <Autocomplete
                                            id="comparisonYear2"
                                            isOptionEqualToValue={(option: string, value: string) => option === value}
                                            options={["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]}
                                            onChange={this.handleCY2Change}
                                            value={selectedComparisonYear2}
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
                                </Stack>
                                <Stack direction="row" justifyContent="center" alignItems="center" spacing={21}>
                                    <Box justifyContent="center" alignItems="center" sx={{ width: 240, height: 240, ml: 9 }}>
                                        <Pie options={pieGraphOptions} data={pieData} />
                                    </Box>
                                    <Box justifyContent="center" alignItems="center" sx={{ width: 240, height: 240 }}>
                                        <Pie options={pieGraphOptions} data={pieDataComparison} />
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>


                        <Box sx={{ width: 450, height: 300 }}>
                            <Stack justifyContent="center" alignItems="center">
                                <Typography variant="h6" sx={{ color: "#464555", ml: 10 }}>
                                    <b>Tiempo de Caducidad por Producto</b>
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 240 }}>
                                    <Autocomplete
                                        id="product"
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