import React, { Component } from 'react'
import { AppBar, Avatar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { Menu, Logout, People, Home, Inventory, Domain, LocalShipping, EmojiTransportation, LocationOn  } from '@mui/icons-material';
import { AuthContext } from '../Auth/AuthContext';
import { signUserOut } from '../Auth/AuthOperations';
import { Link } from 'react-router-dom';

type Props = {}

type State = {
    open: boolean,
    userShortName: string,
    userFullName: string
}

export default class NavBar extends Component<Props, State> {
    static contextType = AuthContext
    context!: React.ContextType<typeof AuthContext>;

    state: State = {
        open: false,
        userFullName: "",
        userShortName: "NA"
    }

    componentDidMount(): void {
        const { currentUser } = this.context!
        let fullName = currentUser!.firstName + " " + currentUser!.lastName
        let shortName = currentUser!.firstName[0] + currentUser!.lastName[0]
        this.setState({
            userFullName: fullName,
            userShortName: shortName
        })
    }

    toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Tab') {
            return;
        }

        this.setState({ open: !this.state.open })
    };

    signCurrentUserOut = async () => {
        await signUserOut()
    }

    render() {
        const { open, userFullName, userShortName } = this.state

        return (
            <React.Fragment>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" sx={{ bgcolor: "#002366" }}>
                        <Toolbar>
                            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}
                                onClick={this.toggleDrawer}>
                                <Menu />
                            </IconButton>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                Sistema G.V.H.
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Box>

                <Drawer anchor="left" open={open} onClose={this.toggleDrawer}>
                    <Box sx={{ width: 250, bgcolor: "#002366", color: "white", height: "100vh" }} onClick={this.toggleDrawer} onKeyDown={this.toggleDrawer}>
                        <Box width="100%" sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 3, pb: 1 }}>
                            <Avatar sx={{ bgcolor: "white", color: "#002366", mb: 1, textTransform: 'capitalize' }}>{userShortName}</Avatar>
                            <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                                {userFullName}
                            </Typography>
                        </Box>
                        <List>
                            <Link to="/" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><Home /></ListItemIcon>
                                        <ListItemText primary={"Home"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/productos" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><Inventory /></ListItemIcon>
                                        <ListItemText primary={"Productos"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/lugaresentrega" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><Domain /></ListItemIcon>
                                        <ListItemText primary={"Lugares de Entrega"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/entregaproducto" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><LocalShipping /></ListItemIcon>
                                        <ListItemText primary={"Entregas de Productos"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/zonasentrega" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><LocationOn /></ListItemIcon>
                                        <ListItemText primary={"Zonas de Entrega"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/proveedores" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><EmojiTransportation /></ListItemIcon>
                                        <ListItemText primary={"Proveedores"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/usuarios" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><People /></ListItemIcon>
                                        <ListItemText primary={"Usuarios"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <Link to="/logs" style={{ textDecoration: 'none', color:"white" }}>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon sx={{ color: "white" }}><People /></ListItemIcon>
                                        <ListItemText primary={"Logs"} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => this.signCurrentUserOut()}>
                                    <ListItemIcon sx={{ color: "white" }}><Logout /></ListItemIcon>
                                    <ListItemText primary={"Cerrar Sesión"} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            </React.Fragment>
        )
    }
}
