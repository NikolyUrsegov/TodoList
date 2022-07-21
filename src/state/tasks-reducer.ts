import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistACType, RemoveTodolistACType} from "./todolists-reducer";

export const tasksReducer = (state: TasksStateType, action: tsarType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.TodolistId]: state[action.payload.TodolistId].filter(t => t.id !== action.payload.id)
            }
        }
        case 'ADD-TASK': {
            let task = {id: v1(), title: action.payload.task, isDone: false}
            return {
                ...state,
                [action.payload.TodolistId]: [task, ...state[action.payload.TodolistId]]
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state, [action.payload.TodolistId]:
                    state[action.payload.TodolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        isDone: action.payload.isDone
                    } : t)
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state, [action.payload.TodolistId]:
                    state[action.payload.TodolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        title: action.payload.title
                    } : t)
            }
        }
        case "ADD-TODOLIST": {
            return {
                [action.payload.todolistId]: [],
                ...state
            }
        }
        case "REMOVE-TODOLIST": {
            let newState = {...state}
            delete newState[action.payload.todolistId1]
            return newState
        }
        default:
            return state
    }
}

type tsarType = RemoveTaskACType | AddTaskACType | ChangeTaskStatusACType | ChangeTaskTitleACType | AddTodolistACType | RemoveTodolistACType;
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (id: string, TodolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id: id,
            TodolistId: TodolistId
        }
    } as const;
}
type AddTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (task: string, TodolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            task: task,
            TodolistId: TodolistId
        }
    } as const;
}
type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (taskId: string, isDone: boolean, TodolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId: taskId,
            isDone: isDone,
            TodolistId: TodolistId
        }
    } as const;
}
type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (taskId: string, title: string, TodolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            taskId: taskId,
            title: title,
            TodolistId: TodolistId
        }
    } as const;
}
