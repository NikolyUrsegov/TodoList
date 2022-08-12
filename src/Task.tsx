import React, {memo} from 'react';
import CheckBoxComponent from "./CheckBoxComponent";
import EditableSpan from "./EditableSpan";
import {IconButton} from '@mui/material';
import {Delete} from "@mui/icons-material";
import {TaskType} from "./state/tasks-reducer";

type TaskPropsType = {
    task: TaskType
    removeTask: (taskID: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    changeTaskTitle: (id: string, title: string) => void

}
const Task = memo(({task, removeTask, changeTaskTitle, changeTaskStatus}: TaskPropsType) => {
    const onRemoveTask = () => {
        removeTask(task.id)
    }
    const onChangeTask = (title: string) => {
        changeTaskTitle(task.id, title)
    }
    const changeTaskStatusHandler = (isDone: boolean) => {
        changeTaskStatus(task.id, isDone)
    }

    return (
        <div key={task.id}>
            <CheckBoxComponent isDone={task.isDone} changeTaskStatus={changeTaskStatusHandler}/>
            <EditableSpan
                title={task.title}
                class={task.isDone ? 'isDone' : ''}
                changeTask={onChangeTask}/>
            <IconButton onClick={onRemoveTask}>
                <Delete/>
            </IconButton>
        </div>
    );
});

export default Task;