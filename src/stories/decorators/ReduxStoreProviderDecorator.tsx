import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers} from 'redux'

import {v1} from 'uuid'
import thunkMiddleware from 'redux-thunk'
import {configureStore} from '@reduxjs/toolkit'
import {HashRouter} from 'react-router-dom'
import {AppRootStateType, RootReducerType} from '../../state/store'
import { tasksReducer } from '../../state/reducers/tasks-reducer'
import {authReducer} from "../../state/reducers/auth-reducer";
import {appReducer} from "../../state/reducers/app-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolists-api";
import {todolistsReducer} from "../../state/reducers/todolists-reducer";


const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn What to learn What to learn What to learn", filter: "all", entityStatusTodolist: 'idle', addedDate: '', order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", entityStatusTodolist: 'loading', addedDate: '', order: 0}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: "idle"},
            {id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: "idle"}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: "idle"},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: "idle"}
        ]
    },
    app: {
        error: null,
        status: 'succeeded',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)


export const BrowserRouterDecorator = (storyFn: any) => (
    <HashRouter>{storyFn()}
    </HashRouter>)
