import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";


export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "js", isDone: false},
        {id: v1(), title: "react", isDone: true}
    ])
    const [filter, setFilter] = useState<FilterValuesType>('all')

    const removeTask = (taskID: string) => {
        const filteredTasks = tasks.filter(t => t.id !== taskID);
        setTasks(filteredTasks)
    }

    const addTask = (title: string) => {
        let task = {id: v1(), title: title, isDone: true}
        let newTasks = [task, ...tasks]
        setTasks(newTasks)
    }

    const changeTodoListFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    let tasksForRender = tasks;

    switch (filter) {
        case "active":
            tasksForRender = tasks.filter(t => t.isDone === true)
            break
        case "completed":
            tasksForRender = tasks.filter(t => t.isDone === false)
            break
        default:
            tasksForRender = tasks

    }

    return (
        <div className="App">

            <TodoList title={"One List"}
                      tasks={tasksForRender}
                      removeTask={removeTask}
                      changeTodoListFilter={changeTodoListFilter}
                      addTask={addTask}
            />
        </div>
    );
}

export default App;
