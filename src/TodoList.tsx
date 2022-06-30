import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";

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
    changeTaskTitle: (id: string, title: string, todolistId: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
}
const TodoList = (props: TodoListPropsType) => {
    const addTaskItem = (title: string) => {
        props.addTask(title, props.id)
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title)
    }


    const onAllClickHandler = () => props.changeTodoListFilter('all', props.id)
    const onActiveClickHandler = () => props.changeTodoListFilter('active', props.id)
    const onCompleteClickHandler = () => props.changeTodoListFilter('completed', props.id)

    return (
        <div>
            <div>
                <h3 style={{display: "inline-block", marginRight: '10px'}}>
                    <EditableSpan title={props.title} changeTask={changeTodolistTitle}/>
                </h3>
                <button onClick={() => props.removeTodoList(props.id)}>X</button>
            </div>
            <AddItemForm addItem={addTaskItem}/>
            <ul>
                {props.tasks.length ?
                    props.tasks.map(item => {

                        const onRemoveTask = () => {
                            props.removeTask(item.id, props.id)
                        }
                        const onChangeTask = (title: string) => {
                            props.changeTaskTitle(item.id, title, props.id)
                        }

                        return (
                            <li key={item.id}>
                                <input
                                    onChange={(e) => props.changeTaskStatus(item.id, e.currentTarget.checked, props.id)}
                                    type="checkbox" checked={item.isDone}/>
                                <EditableSpan
                                    title={item.title}
                                    class={item.isDone ? 'isDone' : ''}
                                    changeTask={onChangeTask}/>
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