import {
    AddTodolistActionType,
    changeEntityStatusTodolist,
    RemoveTodolistActionType,
    setTodolistType
} from './todolists-reducer';
import {TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from '../store';
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export type FullTaskType = TaskType & {
    entityStatusTask: RequestStatusType
}
export type TasksStateType = {
    [key: string]: Array<FullTaskType>
}

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    task: TaskType
}

export type ChangeUpdateTaskActionType = {
    type: 'UPDATE-TASK-TITLE',
    todolistId: string
    taskId: string
    task: TaskType
}

export type setTaskACType = ReturnType<typeof setTaskAC>

export type ChangeEntityStatusTaskType = {
    type: 'CHANGE_ENTITY_STATUS_TASK',
    taskId: string
    todolistId: string
    status: RequestStatusType
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | setTodolistType
    | setTaskACType
    | ChangeUpdateTaskActionType
    | ChangeEntityStatusTaskType


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

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId);
            return stateCopy;
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.todolistId]: [{...action.task, entityStatusTask: 'idle'}, ...state[action.todolistId]]
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET_TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET_TASKS": {
            return {
                ...state,
                [action.todolistId]: action.tasks.map(task => ({...task, entityStatusTask: 'idle'}))
            }
        }
        case "UPDATE-TASK-TITLE": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
                    ? {...action.task, entityStatusTask: 'idle'}
                    : t)
            }
        }
        case "CHANGE_ENTITY_STATUS_TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? {...task, entityStatusTask: action.status}
                    : task
                )
            }
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType, todolistId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', task, todolistId}
}
export const changeUpdateTaskAC = (taskId: string, task: TaskType, todolistId: string): ChangeUpdateTaskActionType => {
    return {type: 'UPDATE-TASK-TITLE', task, todolistId, taskId}
}

export const changeEntityStatusTask = (todolistId: string, taskId: string, status: RequestStatusType): ChangeEntityStatusTaskType => {
    return {type: 'CHANGE_ENTITY_STATUS_TASK', taskId, status, todolistId}
}

export const setTaskAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET_TASKS',
        todolistId,
        tasks
    } as const
}

export const getTaskTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTaskAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
        })
}


export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeEntityStatusTask(todolistId, taskId, "loading"))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeEntityStatusTask(todolistId, taskId, "succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTask(todolistId, taskId, "failed"))
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTask(todolistId, taskId, "failed"))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeEntityStatusTodolist(todolistId, "loading"))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item, todolistId))
                dispatch(setAppStatusAC('succeeded'))
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

export const updateTaskTC = (todolistId: string, model: UpdateTaskModelType, taskId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeEntityStatusTask(todolistId, taskId, "loading"))
    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => {
        return t.id === taskId
    })
    task && todolistsAPI.updateTask(todolistId, taskId, {...task, ...model})
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeUpdateTaskAC(taskId, res.data.data.item, todolistId))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeEntityStatusTask(todolistId, taskId, "succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeEntityStatusTask(todolistId, taskId, "failed"))
            }
        })
        .catch((e) => {
            handleServerNetworkError({message: e.message}, dispatch)
            dispatch(changeEntityStatusTask(todolistId, taskId, "failed"))
        })
}

