import React from 'react';
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import CheckBoxComponent from "./CheckBoxComponent";
import {TaskType} from "./state/tasks-reducer";
import {FilterValuesType} from "./state/todolists-reducer";

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
    const changeTaskStatus = (id: string, isDone: boolean) => {
        props.changeTaskStatus(id, isDone, props.id)
    }

    return (
        <div>
            <div>
                <h3 style={{display: "inline-block", marginRight: '10px'}}>
                    <EditableSpan title={props.title} changeTask={changeTodolistTitle}/>
                </h3>
                <IconButton onClick={() => props.removeTodoList(props.id)}>
                    <Delete/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTaskItem}/>
            <div>
                {props.tasks.length ?
                    props.tasks.map(item => {

                        const onRemoveTask = () => {
                            props.removeTask(item.id, props.id)
                        }
                        const onChangeTask = (title: string) => {
                            props.changeTaskTitle(item.id, title, props.id)
                        }
                        const changeTaskStatusHandler = (isDone: boolean) => {
                            changeTaskStatus(item.id, isDone)
                        }

                        return (
                            <div key={item.id}>
                                <CheckBoxComponent isDone={item.isDone} changeTaskStatus={changeTaskStatusHandler}/>
                                <EditableSpan
                                    title={item.title}
                                    class={item.isDone ? 'isDone' : ''}
                                    changeTask={onChangeTask}/>
                                <IconButton onClick={onRemoveTask}>
                                    <Delete/>
                                </IconButton>
                            </div>
                        )
                    })
                    :
                    <span>Create your first task!</span>
                }
            </div>
            <div>
                <Button
                    variant={props.filter === 'all' ? 'contained' : 'text'}
                    onClick={onAllClickHandler}>All
                </Button>
                <Button
                    variant={props.filter === 'active' ? 'contained' : 'text'}
                    color={'primary'}
                    onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                    variant={props.filter === 'completed' ? 'contained' : 'text'}
                    color={'secondary'}
                    onClick={onCompleteClickHandler}>Completed
                </Button>
            </div>
        </div>
    );
}

export default TodoList;