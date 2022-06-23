import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from "./App";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}
type TodoListPropsType = {
    title: string,
    id: string,
    tasks: TaskType[],
    filter: FilterValuesType
    removeTask: (taskID: string, todolistId: string) => void,
    removeTodoList: (id: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todolistID: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
}
const TodoList = (props: TodoListPropsType) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        error && setError(false)
    }

    const onAddTaskClickHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addTask(trimmedTitle, props.id)
        } else {
            setError(true)
        }
        setTitle('')

    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAddTaskClickHandler()
        }
    }

    const onAllClickHandler = () => props.changeTodoListFilter('all', props.id)
    const onActiveClickHandler = () => props.changeTodoListFilter('active', props.id)
    const onCompleteClickHandler = () => props.changeTodoListFilter('completed', props.id)

    return (
        <div>
            <div >
                <h3 style={{display: "inline-block", marginRight: '10px'}}>{props.title}</h3>
                <button onClick={() => props.removeTodoList(props.id)}>X</button>
            </div>
            <div>
                <input value={title}
                       className={error ? 'error' : ''}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyDownHandler}/>
                <button onClick={onAddTaskClickHandler}>+</button>
                {error && <div style={{color: 'red'}}>Title is required</div>}
            </div>
            <ul>
                {props.tasks.length ?
                    props.tasks.map(item => {
                        const onRemoveTask = () => {
                            props.removeTask(item.id, props.id)
                        }
                        return (
                            <li key={item.id}>
                                <input
                                    onChange={(e) => props.changeTaskStatus(item.id, e.currentTarget.checked, props.id)}
                                    type="checkbox" checked={item.isDone}/>
                                <span className={item.isDone ? 'isDone' : ''}>{item.title}</span>
                                <button onClick={onRemoveTask}>x</button>
                            </li>
                        )
                    })
                    :
                    <span>Create your first task!</span>
                }
            </ul>
            <div>
                <button
                    className={props.filter === 'all' ? 'active' : ''}
                    onClick={onAllClickHandler}>All
                </button>
                <button
                    className={props.filter === 'active' ? 'active' : ''}
                    onClick={onActiveClickHandler}>Active
                </button>
                <button
                    className={props.filter === 'completed' ? 'active' : ''}
                    onClick={onCompleteClickHandler}>Completed
                </button>
            </div>
        </div>
    );
}

export default TodoList;