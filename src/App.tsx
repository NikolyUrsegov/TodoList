import React from 'react';
import './App.css';
import {AppBar, Toolbar, IconButton, Typography, Button, Container, LinearProgress} from '@mui/material';
import {Menu} from "@mui/icons-material";
import TodolistList from "./components/TodolistList";
import {AppRootStateType} from "./state/store";
import {RequestStatusType} from "./state/reducers/app-reducer";
import {useSelector} from "react-redux";
import {ErrorSnackbar} from "./components/ErrorSnackbar";

const App = () => {
    const appStatus = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {
                appStatus === 'loading'
                    ? <LinearProgress/>
                    : null
            }
            <Container fixed>
                <TodolistList/>
            </Container>
        </div>
    )
}

export default App;
