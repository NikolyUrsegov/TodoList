import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType} from "./store";
import {combineReducers, legacy_createStore as createStore} from "redux";
import {tasksReducer} from "./reducers/tasks-reducer";
import {todolistsReducer} from "./reducers/todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {RequestStatusType} from "./reducers/app-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatusTodolist: "succeeded"},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatusTodolist: "succeeded"}
    ],
    tasks: {
        "todolistId1": [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: 'idle' },
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: 'idle' },
            {id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: 'idle' }
        ],
        "todolistId2": [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: 'idle' },
            {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: 'idle' },
            {id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatusTask: 'idle' }
        ]
    },
    app: {
        status: 'loading' as RequestStatusType,
        error: null as null | string,
        isInitialized: true

    },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);
const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return (
        <Provider store={storyBookStore}>{storyFn()}</Provider>
    );
};

export default ReduxStoreProviderDecorator;