import React, { Component } from 'react'
import NavBar from './NavBar'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId , esES} from '@mui/x-data-grid';
import { Delete, Security } from "@mui/icons-material";
import { Alert, Box, Container, Snackbar, Typography } from '@mui/material';
import UserService from '../Services/UserService';
import IUserData from '../Utilities/Interfaces/IUserData';
import IMessage from '../Utilities/Interfaces/IMessage';
import { AuthContext } from '../Auth/AuthContext';
import { getError } from '../Utilities/ErrorHandler';

type Props = {}

type State = {
    users: Array<IUserData>,
    columnHeaders: Array<GridColDef<IUserData>>,
    message: IMessage
}

export default class Users extends Component<Props, State>{
    static contextType = AuthContext
    context!: React.ContextType<typeof AuthContext>;

    state: State = {
        users: [],
        columnHeaders: [
            { field: "firstName", headerName: "Nombre", headerAlign: "center", width: 150, type: "string" },
            { field: "lastName", headerName: "Apellido", headerAlign: "center", width: 150, type: "string" },
            { field: "userName", headerName: "Correo", headerAlign: "center", width: 200, type: "string" },
            { field: "isAdmin", headerName: "Administrador", headerAlign: "center", width: 130, type: "boolean" },
            {
                field: "Actions", type: "actions", width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Delete sx={{color: "#464555"}}/>}
                        label="Delete"
                        onClick={() => this.deleteUser(params.row.userUId!)}
                    />,
                    this.context!.currentUser?.isAdmin ? <GridActionsCellItem
                        icon={<Security sx={{color: "#464555"}}/>}
                        label="Convertir en Admin."
                        onClick={() => this.makeUserAnAdmin(params.id)}
                        showInMenu
                    /> : <></>,
                ]
            },
        ],
        message: {
            show: false,
            text: "",
            type: "success"
        }
    }

    async componentDidMount() {
        const users = (await UserService.getAll()).data
        this.setState({
            users
        })
    }

    deleteUser = async (userUId: string) => {
        try {
            const response = await UserService.deleteUser(userUId)
            if (response.status === 200){
                const users = (await UserService.getAll()).data
                this.prepareMessage("Usuario eliminado correctamente.", false)
                this.setState({
                    users
                })
            }
        } catch (error) {
            let convertedError = getError(error)
            this.prepareMessage(convertedError.message, true)
        }
    }

    makeUserAnAdmin = async (userId: GridRowId) => {
        const response = await UserService.makeAdmin(Number(userId.toString()))

        if (response.status === 200) {
            const users = (await UserService.getAll()).data
            this.prepareMessage("El usuario fue actualizado correctamente.", false)
            this.setState({
                users
            })
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
        const { users, columnHeaders, message } = this.state

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
                            <Typography variant="h4" sx={{color:"#464555"}}>
                                <b>Usuarios</b>
                            </Typography>

                        </Box>
                        <Box sx={{ height: 500, width: "100%", }}>
                            <DataGrid
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                sx={{ boxShadow: 3 }}
                                columns={columnHeaders}
                                rows={users}
                            />
                        </Box>
                    </Container>
                </Box>
            </React.Fragment>
        )
    }
}
