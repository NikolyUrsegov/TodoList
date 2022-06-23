import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";


export type FilterValuesType = 'all' | 'active' | 'completed'
type TodoListsType = {
    title: string,
    id: string,
    filter: FilterValuesType
}
type TaskStateType = {
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

    const [tasks, setTasks] = useState<TaskStateType>({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "js", isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: "js", isDone: false},
            {id: v1(), title: "react", isDone: true}
        ]
    })

    const removeTask = (taskID: string, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = todolistTasks.filter(t => t.id !== taskID);
        setTasks({...tasks})
    }
    const removeTodoList = (id: string) => {
        setTodolists(todolists.filter(tl => tl.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    }
    const addTask = (title: string, todolistId: string) => {
        let task = {id: v1(), title: title, isDone: false}
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = [task, ...todolistTasks]
        setTasks({...tasks})
    }
    const changeTodoListFilter = (filter: FilterValuesType, todolistID: string) => {
        setTodolists(todolists.map(el => el.id === todolistID ? {...el, filter: filter} : el))
    }
    const changeTaskStatus = (id: string, isDone: boolean, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === id ? {...t, isDone: isDone} : t)})
    }

    return (
        <div className="App">
            {todolists.map(el => {
                let allTodoListTasks = tasks[el.id]
                let tasksForRender = allTodoListTasks;
                switch (el.filter) {
                    case "active":
                        tasksForRender = allTodoListTasks.filter(t => t.isDone === true)
                        break
                    case "completed":
                        tasksForRender = allTodoListTasks.filter(t => t.isDone === false)
                        break
                    default:
                        tasksForRender = allTodoListTasks
                }

                return <TodoList
                    key={el.id}
                    title={el.title}
                    id={el.id}
                    tasks={tasksForRender}
                    filter={el.filter}
                    removeTask={removeTask}
                    removeTodoList={removeTodoList}
                    changeTodoListFilter={changeTodoListFilter}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                />
            })}
        </div>
    );
}

export default App;
