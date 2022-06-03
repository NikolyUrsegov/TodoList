import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";


export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "js", isDone: false},
        {id: 3, title: "react", isDone: true}
    ])
    const [filter, setFilter] = useState<FilterValuesType>('all')

    const removeTask = (taskID: number) => {
        const filteredTasks = tasks.filter(t => t.id !== taskID);
        setTasks(filteredTasks)
    }
    const changeTodoListFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    let tasksForRender = tasks;

    switch (filter) {
        case "active":
            tasksForRender = tasks.filter(t => t.isDone === false)
            break
        case "completed":
            tasksForRender = tasks.filter(t => t.isDone === true)
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
            />
        </div>
    );
}

export default App;
