import React, { Component } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid'
import NavBar from './NavBar'
import ILogsData from '../Utilities/Interfaces/ILogsData'
import LogsService from '../Services/LogsService'

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
        logs: [],
    }
    async componentDidMount() {
        const logs = (await LogsService.getLogs()).data
        this.setState({
            logs
        })
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
