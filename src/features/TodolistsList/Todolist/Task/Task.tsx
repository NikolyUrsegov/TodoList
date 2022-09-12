import React, {memo, useCallback} from 'react';
import CheckBoxComponent from "../../../../components/CheckBoxComponent";
import EditableSpan from "../../../../components/EditableSpan";
import {IconButton} from '@mui/material';
import {Delete} from "@mui/icons-material";
import {FullTaskType, removeTaskTC, updateTaskTC} from "../../../../state/reducers/tasks-reducer";
import {useDispatch} from "react-redux";
import {TaskStatuses} from "../../../../api/todolists-api";
import {AppDispatch} from "../../../../state/store";

type TaskPropsType = {
    task: FullTaskType
    todolistId: string
}
const Task = memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useDispatch<AppDispatch>()

    const onRemoveTask = () => {
        dispatch(removeTaskTC(todolistId, task.id))
    }
    const onChangeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC(todolistId, {title}, task.id))
    }, [dispatch, task.id, todolistId])

    const changeTaskStatusHandler = useCallback((isDone: boolean) => {
        const status = isDone ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(todolistId, {status}, task.id))
    }, [dispatch, task.id, todolistId])

    return (
        <div key={task.id}>
            <CheckBoxComponent status={task.status} changeTaskStatus={changeTaskStatusHandler} disabled={task.entityStatusTask === 'loading'}/>
            <EditableSpan
                title={task.title}
                changeTask={onChangeTaskTitle}
                disabled={task.entityStatusTask === 'loading'}
            />
            <IconButton onClick={onRemoveTask} disabled={task.entityStatusTask === 'loading'}>
                <Delete/>
            </IconButton>
        </div>
    );
});

export default Task;