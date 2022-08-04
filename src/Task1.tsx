import React, {memo, useCallback} from 'react';
import CheckBoxComponent from "./CheckBoxComponent";
import EditableSpan from "./EditableSpan";
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TaskType} from "./state/tasks-reducer";
import {useDispatch} from "react-redux";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
const Task1 = memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useDispatch()

    const onRemoveTask = () => {
        dispatch(removeTaskAC(task.id, todolistId))
    }
    const onChangeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(task.id, title, todolistId))
    }, [dispatch, task.id, todolistId])

    const changeTaskStatusHandler = useCallback((isDone: boolean) => {
        dispatch(changeTaskStatusAC(task.id, isDone, todolistId))
    }, [dispatch, task.id, todolistId])

    return (
        <div key={task.id}>
            <CheckBoxComponent isDone={task.isDone} changeTaskStatus={changeTaskStatusHandler}/>
            <EditableSpan
                title={task.title}
                changeTask={onChangeTaskTitle}/>
            <IconButton onClick={onRemoveTask}>
                <Delete/>
            </IconButton>
        </div>
    );
});

export default Task1;