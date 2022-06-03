import React from 'react';
import {FilterValuesType} from "./App";

export type TaskType = {
    id: number,
    title: string,
    isDone: boolean
}
type TodoListPropsType = {
    title: string,
    tasks: TaskType[],
    removeTask: (taskID: number) => void,
    changeTodoListFilter: (filter: FilterValuesType) => void

}
const TodoList = (props: TodoListPropsType) => {
    const tasksJSX = props.tasks.map(item => {
        return (
            <li key={item.id}>
                <input type="checkbox" checked={item.isDone}/>
                <span>{item.title}</span>
                <button onClick={() => props.removeTask(item.id)}>x</button>
            </li>
        )
    })
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {tasksJSX}
            </ul>
            <div>
                <button onClick={() => props.changeTodoListFilter('all')}>All</button>
                <button onClick={() => props.changeTodoListFilter('active')}>Active</button>
                <button onClick={() => props.changeTodoListFilter('completed')}>Completed</button>
            </div>
        </div>
    );
}

export default TodoList;