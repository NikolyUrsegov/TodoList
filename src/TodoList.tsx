import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from "./App";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}
type TodoListPropsType = {
    title: string,
    tasks: TaskType[],
    removeTask: (taskID: string) => void,
    changeTodoListFilter: (filter: FilterValuesType) => void
    addTask: (title: string) => void
}
const TodoList = (props: TodoListPropsType) => {
    let [title, setTitle] = useState('')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onAddTaskClickHandler = () => {
        props.addTask(title)
        setTitle('')
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        console.log(e.key)
        if (e.key == 'Enter') {
            onAddTaskClickHandler()
        }
    }

    const onAllClickHandler = () => props.changeTodoListFilter('all')
    const onActiveClickHandler = () => props.changeTodoListFilter('active')
    const onCompleteClickHandler = () => props.changeTodoListFilter('completed')

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyDownHandler}/>
                <button onClick={onAddTaskClickHandler}>+</button>
            </div>
            <ul>
                {props.tasks.map(item => {
                    const onRemoveTask = () => {
                        props.removeTask(item.id)
                    }

                    return (
                        <li key={item.id}>
                            <input type="checkbox" checked={item.isDone}/>
                            <span>{item.title}</span>
                            <button onClick={onRemoveTask}>x</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={onAllClickHandler}>All</button>
                <button onClick={onActiveClickHandler}>Active</button>
                <button onClick={onCompleteClickHandler}>Completed</button>
            </div>
        </div>
    );
}

export default TodoList;