import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography, Grid, Stack, Select, FormControl, InputLabel, MenuItem, SelectChangeEvent } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import NavBar from './NavBar'
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

type Props = {}

type State = {
    year: string,
    month: string,
    product: string,    
    options: ChartOptions<'bar'>,
    data: ChartData<'bar'>,
}

export default class Home extends Component<Props, State> {
    state: State = {
        year: "",
        month: "",
        product: "",
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart',
                },
            },
        },
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [12, 40, 21, 2, 32, 10],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Dataset 2',
                    data: [2, 6, 5, 2, 3, 5],
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        },
    }
    /*handleDeliveryLocationChange = (event: SyntheticEvent<Element, Event>, value: IDeliveryLocationData | null) => {
        if (value !== null) {
            this.setState({ deliveryLocationChoosed: value });
        } else {
            this.setState({ deliveryLocationChoosed: null });
        }
    }*/
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

    render() {
        const { year, month, product, options, data } = this.state
        return (
            <React.Fragment>
                <NavBar />
                <Box>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={20} sx={{ p: 8 }}>
                        <Box sx={{ width: 300, height: 300, backgroundColor: 'primary.dark', '&:hover': { backgroundColor: 'primary.main', opacity: [0.9, 0.8, 0.7], }, }}>
                            productos por lugar
                        </Box>
                        <Box sx={{ width: 300, height: 300, backgroundColor: 'primary.dark', '&:hover': { backgroundColor: 'primary.main', opacity: [0.9, 0.8, 0.7], }, }}>
                            venta por lugar de entrega
                        </Box>
                        <Box sx={{ width: 300, height: 300, backgroundColor: 'primary.dark', '&:hover': { backgroundColor: 'primary.main', opacity: [0.9, 0.8, 0.7], }, }}>
                            tiempo caducidad por producto
                        </Box>
                    </Stack>
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
                            <Box justifyContent="center" sx={{ width: 1000, height: 300, backgroundColor: 'primary.dark' }}>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </React.Fragment >
        )
    }
}