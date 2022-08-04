import React, {useCallback, memo} from 'react';
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskType} from "./state/tasks-reducer";
import {FilterValuesType} from "./state/todolists-reducer";
import Task1 from "./Task1";

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

const TodoList = memo((props: TodoListPropsType) => {
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
            tasksForRender = tasksForRender.filter(t => t.isDone === false)
            break
        }
        case "completed": {
            tasksForRender = tasksForRender.filter(t => t.isDone === true)
            break
        }
        default:
            tasksForRender = [...props.tasks]
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
                {tasksForRender ?
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