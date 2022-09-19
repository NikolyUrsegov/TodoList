import {tasksReducer} from './reducers/tasks-reducer';
import {todolistsReducer} from './reducers/todolists-reducer';
import {AnyAction, combineReducers} from 'redux';
import {ThunkDispatch} from "redux-thunk";
import thunk from 'redux-thunk'
import {appReducer} from "./reducers/app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {authReducer} from "./reducers/auth-reducer";
import { configureStore } from '@reduxjs/toolkit'



const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
export const store = configureStore(
    {
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().prepend(thunk),
    }
);

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// @ts-ignore
window.store = store;