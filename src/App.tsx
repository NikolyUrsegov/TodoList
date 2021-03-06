import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Toolbar, IconButton, Typography, Button, Container, Grid, Paper} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListsType = {
    title: string,
    id: string,
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    // const [tasks, setTasks] = useState<Array<TaskType>>([
    //     {id: v1(), title: "HTML&CSS", isDone: true},
    //     {id: v1(), title: "js", isDone: false},
    //     {id: v1(), title: "react", isDone: true}
    // ])

    let todolistId1 = v1();
    let todolistId2 = v1();

    const [todolists, setTodolists] = useState<Array<TodoListsType>>([
        {
            id: todolistId1,
            title: "One List",
            filter: "all"
        },
        {
            id: todolistId2,
            title: "Two List",
            filter: "all"
        }
    ])
    const [tasks, setTasks] = useState<TasksStateType>({
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
        const todolistId = v1()
        let newtodolist: TodoListsType = {id: todolistId, title: title, filter: "all"}
        setTodolists([newtodolist, ...todolists])
        setTasks({
            ...tasks,
            [todolistId]: []
        })
    }
    const removeTodoList = (id: string) => {
        setTodolists(todolists.filter(tl => tl.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    }
    const changeTodoListFilter = (filter: FilterValuesType, todolistID: string) => {
        setTodolists(todolists.map(el => el.id === todolistID ? {...el, filter: filter} : el))
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: title} : el))
    }

    const removeTask = (taskID: string, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = todolistTasks.filter(t => t.id !== taskID);
        setTasks({...tasks})
    }
    const addTask = (title: string, todolistId: string) => {
        let task = {id: v1(), title: title, isDone: false}
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = [task, ...todolistTasks]
        setTasks({...tasks})
    }

    const changeTaskStatus = (id: string, isDone: boolean, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === id ? {...t, isDone: isDone} : t)})
    }
    const changeTaskTitle = (id: string, title: string, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === id ? {...t, title: title} : t)})
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
