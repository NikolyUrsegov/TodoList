import React, {ChangeEvent, memo, useState} from 'react';
import {TextField} from '@mui/material';

type EditableSpanPropsType = {
    title: string
    class?: string
    changeTask: (title: string) => void
    disabled?: boolean
}
const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState('')
    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode =() => {
        setEditMode(false)
        props.changeTask(title)
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    return (
        <>
            {editMode
                ? <TextField variant={'outlined'}
                             value={title}
                             onChange={changeTitle}
                             onBlur={activateViewMode}
                             disabled={props.disabled}
                             autoFocus
                />
                : <span className={props.class} onDoubleClick={activateEditMode}>{props.title}</span>}
        </>
    );
});

export default EditableSpan;