import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatusTodolist: RequestStatusType
}
const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatusTodolist: 'idle'})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].title = action.payload.title
            }
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeEntityStatusTodolist(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state[index].entityStatusTodolist = action.payload.status
            }
        },
        setTodolist(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
                return state = action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatusTodolist: "succeeded"}))
        }
    }
})
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeEntityStatusTodolist,
    setTodolist
} = slice.actions
export const todolistsReducer = slice.reducer




export const getTodolistTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setTodolist({todolists: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((e) => {
            debugger
            handleServerNetworkError({message: e.message}, dispatch)
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistsAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
        })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeEntityStatusTodolist({todolistId, status: "loading"}))
    todolistsAPI.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId: todolistId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
                dispatch(changeEntityStatusTodolist({todolistId, status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTodolist({todolistId, status: "failed"}))
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTodolist({todolistId, status: "failed"}))
        })
}

export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeEntityStatusTodolist({todolistId, status: "loading"}))
    todolistsAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({id: todolistId, title}))
                dispatch(setAppStatusAC({status: "succeeded"}))
                dispatch(changeEntityStatusTodolist({todolistId, status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTodolist({todolistId, status: "failed"}))

            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTodolist({todolistId, status: "failed"}))
        })
}

