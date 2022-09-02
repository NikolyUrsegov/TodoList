import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}
export type ChangeEntityStatusTodolistType = {
    type: 'CHANGE_ENTITY_STATUS_TODOLIST',
    todolistId: string
    status: RequestStatusType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | setTodolistType | ChangeEntityStatusTodolistType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatusTodolist: RequestStatusType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatusTodolist: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case "SET_TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatusTodolist: "succeeded"}))
        }
        case 'CHANGE_ENTITY_STATUS_TODOLIST': {
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatusTodolist: action.status} : tl)
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}
export const changeEntityStatusTodolist = (todolistId: string, status: RequestStatusType): ChangeEntityStatusTodolistType => {
    return {type: 'CHANGE_ENTITY_STATUS_TODOLIST', todolistId, status}
}

export type setTodolistType = ReturnType<typeof setTodolist>
export const setTodolist = (todolists: TodolistType[]) => {
    return {
        type: 'SET_TODOLISTS',
        todolists
    } as const
}

export const getTodolistTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setTodolist(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            debugger
            handleServerNetworkError({message: e.message}, dispatch)
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
        })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeEntityStatusTodolist(todolistId, "loading"))
    todolistsAPI.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC("succeeded"))
                dispatch(changeEntityStatusTodolist(todolistId, "succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTodolist(todolistId, "failed"))
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTodolist(todolistId, "failed"))
        })
}

export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeEntityStatusTodolist(todolistId, "loading"))
    todolistsAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatusAC("succeeded"))
                dispatch(changeEntityStatusTodolist(todolistId, "succeeded"))
            }else{
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTodolist(todolistId, "failed"))

            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTodolist(todolistId, "failed"))
        })
}

