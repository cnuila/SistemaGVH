import React, { Component } from 'react'
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, esES } from '@mui/x-data-grid'
import { Delete, Edit } from '@mui/icons-material'
import { Navigate } from 'react-router-dom'
import NavBar from './NavBar'
import IMessage from '../Utilities/Interfaces/IMessage'
import ProductService from '../Services/ProductService'
import { getError } from '../Utilities/ErrorHandler'
import IProductViewData from '../Utilities/Interfaces/IProductViewData'
import ILogsData from '../Utilities/Interfaces/ILogsData'

type Props = {}

type State = {
    columnHeaders: Array<GridColDef<ILogsData>>,
    logs: Array<ILogsData>,
}

export default class Logs extends Component<Props, State> {

    state: State = {
        columnHeaders: [{ field: "id", headerName: "Código", headerAlign: "center", align: "center", width: 250, type: "string" },
        { field: "description", headerName: "Descripción", headerAlign: "center", align: "center", width: 600, type: "string" },
        { field: "date", headerName: "Fecha", headerAlign: "center", align: "center", width: 250, type: "string" },
        ],
        logs: [{ id: 1, description: "Producto Agregado", date: "7/JUL/2023" },
        { id: 2, description: "Producto Editado", date: "9/JUL/2023" },
        { id: 3, description: "Delivery Agregado", date: "6/AGO/2023" },
        { id: 4, description: "Zona Agregada", date: "10/AGO/2023" }
        ],
    }

    render() {
        const { columnHeaders, logs } = this.state

        return (
            <React.Fragment>

                <NavBar />
                <Box sx={{ height: "100vh", display: "flex" }}>
                    <Container>
                        <Box sx={{ my: 3 }}>
                            <Typography variant="h4" sx={{ color: "#464555" }}>
                                <b>Logs</b>
                            </Typography>

                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                sx={{ boxShadow: 3 }}
                                columns={columnHeaders}
                                rows={logs}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
