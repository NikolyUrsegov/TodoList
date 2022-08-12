import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";

import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import {Menu} from "@mui/icons-material";

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListsType = {
    title: string,
    id: string,
    filter: FilterValuesType
}


function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();
    const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: "One List", filter: "all"},
        {id: todolistId2, title: "Two List", filter: "all"}
    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "js", isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: "js", isDone: false},
            {id: v1(), title: "react", isDone: true}
        ]
    })

    const addTodoList = (title: string) => {
        let action = addTodolistAC(title)
        dispatchToTasks(action)
        dispatchToTodolists(action)
    }
    const removeTodoList = (id: string) => {
        dispatchToTodolists(removeTodolistAC(id))
        dispatchToTasks(removeTodolistAC(id))
    }
    const changeTodoListFilter = (filter: FilterValuesType, todolistID: string) => {
        dispatchToTodolists(changeFilterAC(todolistID, filter))
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        dispatchToTodolists(changeTodolistTitleAC(todolistId, title))
    }

    const removeTask = (taskID: string, todolistId: string) => {
        dispatchToTasks(removeTaskAC(taskID, todolistId))
    }
    const addTask = (title: string, todolistId: string) => {
        dispatchToTasks(addTaskAC(title, todolistId))
    }
    const changeTaskStatus = (id: string, isDone: boolean, todolistId: string) => {
        dispatchToTasks(changeTaskStatusAC(id, isDone, todolistId))
    }
    const changeTaskTitle = (id: string, title: string, todolistId: string) => {
        dispatchToTasks(changeTaskTitleAC(id, title, todolistId))
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

export default App;
