import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@mui/material";
import AddItemForm from "../../components/AddItemForm";
import TodoList from "./Todolist/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppRootStateType, useAppSelector} from "../../state/store";
import {
    addTodolistTC, changeTodolistFilterAC,
    deleteTodolistTC,
    FilterValuesType, getTodolistTC,
    TodolistDomainType, updateTodolistTC
} from "../../state/reducers/todolists-reducer";
import {createTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from "../../state/reducers/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {Navigate} from "react-router-dom";

const TodolistList = () => {
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useDispatch<AppDispatch>()

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const removeTodoList = useCallback((id: string) => {
        dispatch(deleteTodolistTC(id))
    }, [dispatch])
    const changeTodoListFilter = useCallback((filter: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC({id: todolistId, filter}))
    }, [dispatch])
    const changeTodolistTitle = useCallback((todolistId: string, title: string) => {
        dispatch(updateTodolistTC(todolistId, title))
    }, [dispatch])

    const removeTask = useCallback((taskID: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, taskID))
    }, [dispatch])
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(createTaskTC(todolistId, title))
    }, [dispatch])
    const changeTaskStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, {status}, id))
    }, [dispatch])
    const changeTaskTitle = useCallback((id: string, title: string, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, {title}, id))
    }, [dispatch])

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        dispatch(getTodolistTC())
    }, [])

    if(!isLoggedIn) {
        return <Navigate  to={'/login'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid
                container
                spacing={3}
                justifyContent={"center"}
            >
                {todolists.map(el => {
                    return (
                        <Grid item key={el.id}>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    title={el.title}
                                    id={el.id}
                                    tasks={tasks[el.id]}
                                    entityStatusTodolist={el.entityStatusTodolist}
                                    filter={el.filter}
                                    removeTask={removeTask}
                                    removeTodoList={removeTodoList}
                                    changeTodoListFilter={changeTodoListFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
        ;
};

export default TodolistList;