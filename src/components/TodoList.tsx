import React, {useCallback, memo, useEffect} from 'react';
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from '@mui/material';
import {Delete} from "@mui/icons-material";
import {FilterValuesType} from "../state/reducers/todolists-reducer";
import Task1 from "./Task1";
import {TaskStatuses} from "../api/todolists-api";
import {FullTaskType, getTaskTC} from "../state/reducers/tasks-reducer";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../state/store";
import {RequestStatusType} from "../state/reducers/app-reducer";

type TodoListPropsType = {
    title: string
    id: string
    tasks: FullTaskType[]
    entityStatusTodolist: RequestStatusType
    filter: FilterValuesType
    removeTask: (taskID: string, todolistId: string) => void
    removeTodoList: (id: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todolistID: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (id: string, title: string, todolistId: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
}

const TodoList = memo((props: TodoListPropsType) => {
    const dispatch = useDispatch<AppDispatch>()

    const addTaskItem = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.changeTodolistTitle, props.id])

    const onAllClickHandler = useCallback(() => props.changeTodoListFilter('all', props.id),
        [props.changeTodoListFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeTodoListFilter('active', props.id),
        [props.changeTodoListFilter, props.id])
    const onCompleteClickHandler = useCallback(() => props.changeTodoListFilter('completed', props.id),
        [props.changeTodoListFilter, props.id])


    let tasksForRender = [...props.tasks]
    switch (props.filter) {
        case "active": {
            tasksForRender = tasksForRender.filter(t => t.status === TaskStatuses.New)
            break
        }
        case "completed": {
            tasksForRender = tasksForRender.filter(t => t.status === TaskStatuses.Completed)
            break
        }
        default:
            tasksForRender = [...props.tasks]
    }
    useEffect(() => {
        dispatch(getTaskTC(props.id))
    }, [])

    return (
        <div>
            <div>
                <h3 style={{display: "inline-block", marginRight: '10px'}}>
                    <EditableSpan title={props.title} changeTask={changeTodolistTitle}/>
                </h3>
                <IconButton onClick={() => props.removeTodoList(props.id)} disabled={props.entityStatusTodolist === 'loading'}>
                    <Delete/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTaskItem} disabled={props.entityStatusTodolist === 'loading'}/>
            <div>
                {tasksForRender.length !== 0 ?
                    tasksForRender.map(item => {
                        return (
                            <Task1 key={item.id} task={item} todolistId={props.id}/>
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
})

export default TodoList;