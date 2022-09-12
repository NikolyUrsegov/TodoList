import React, {useEffect} from 'react'
import './App.css'
import {useDispatch, useSelector} from 'react-redux'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "../state/reducers/auth-reducer";
import {AppDispatch, AppRootStateType} from "../state/store";
import {initializeAppTC, RequestStatusType} from "../state/reducers/app-reducer";
import TodolistList from "../features/TodolistsList/TodolistList";



function App() {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
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
                    {isLoggedIn && <Button onClick={logoutHandler} color="inherit">Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistList />}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404 not found</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
