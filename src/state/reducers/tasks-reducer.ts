import {
    addTodolistAC,
    changeEntityStatusTodolist,
    removeTodolistAC,
    setTodolist
} from './todolists-reducer';
import {TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from '../store';
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FullTaskType = TaskType & {
    entityStatusTask: RequestStatusType
}
export type TasksStateType = {
    [key: string]: Array<FullTaskType>
}
const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType, todolistId: string }>) {
            state[action.payload.todolistId].unshift({...action.payload.task, entityStatusTask: 'idle'})
        },
        changeUpdateTaskAC(state, action: PayloadAction<{ taskId: string, task: TaskType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...action.payload.task, entityStatusTask: 'idle'}
            }
        },
        changeEntityStatusTask(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index].entityStatusTask = action.payload.status
            }
        },
        setTaskAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(task => ({...task, entityStatusTask: 'idle'}))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodolist, (state, action) => {
            action.payload.todolists.forEach((tl) => {
                state[tl.id] = []
            })
        })
    }
})

export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, changeUpdateTaskAC, changeEntityStatusTask, setTaskAC} = slice.actions

export const getTaskTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTaskAC({todolistId, tasks: res.data.items}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeEntityStatusTask({todolistId, taskId, status: "loading"}))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({taskId, todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeEntityStatusTask({todolistId, taskId, status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTask({todolistId, taskId, status: "failed"}))
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTask({todolistId, taskId, status: "failed"}))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeEntityStatusTodolist({todolistId, status: "loading"}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item, todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const updateTaskTC = (todolistId: string, model: UpdateTaskModelType, taskId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeEntityStatusTask({todolistId, taskId, status: "loading"}))
    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => {
        return t.id === taskId
    })
    task && todolistsAPI.updateTask(todolistId, taskId, {...task, ...model})
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeUpdateTaskAC({taskId, task: res.data.data.item, todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeEntityStatusTask({todolistId, taskId, status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTask({todolistId, taskId, status: "failed"}))
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTask({todolistId, taskId, status: "failed"}))
        })
}

