import React, {useReducer} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Toolbar, IconButton, Typography, Button, Container, Grid, Paper} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC,
    TodoListsType
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TasksStateType
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";



function AppWithRedux() {
    const todolists =useSelector<AppRootStateType, TodoListsType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const addTodoList = (title: string) => {
        let action = addTodolistAC(title)
        dispatch(action)
    }
    const removeTodoList = (id: string) => {
        dispatch(removeTodolistAC(id))
    }
    const changeTodoListFilter = (filter: FilterValuesType, todolistID: string) => {
        dispatch(changeFilterAC(todolistID, filter))
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        dispatch(changeTodolistTitleAC(todolistId, title))
    }

    const removeTask = (taskID: string, todolistId: string) => {
        dispatch(removeTaskAC(taskID, todolistId))
    }
    const addTask = (title: string, todolistId: string) => {
        dispatch(addTaskAC(title, todolistId))
    }
    const changeTaskStatus = (id: string, isDone: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(id, isDone, todolistId))
    }
    const changeTaskTitle = (id: string, title: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(id, title, todolistId))
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    justifyContent={"center"}
                >
                    {todolists.map(el => {
                        let allTodoListTasks = tasks[el.id]
                        let tasksForRender = allTodoListTasks;
                        switch (el.filter) {
                            case "active":
                                tasksForRender = allTodoListTasks.filter(t => t.isDone === false)
                                break
                            case "completed":
                                tasksForRender = allTodoListTasks.filter(t => t.isDone === true)
                                break
                            default:
                                tasksForRender = allTodoListTasks
                        }

                        return (
                            <Grid item key={el.id}>
                                <Paper style={{padding: '10px'}}>
                                    <TodoList
                                        title={el.title}
                                        id={el.id}
                                        tasks={tasksForRender}
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
            </Container>
        </div>
    )
}

export default AppWithRedux;