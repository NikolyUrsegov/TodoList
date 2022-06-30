import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    class?: string
    changeTask: (title: string) => void
}
const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState('')
    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.changeTask(title)
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    return (
        <>
            {editMode
                ? <input value={title} onChange={changeTitle} onBlur={activateViewMode} autoFocus/>
                : <span className={props.class} onDoubleClick={activateEditMode}>{props.title}</span>}
        </>
    );
};

export default EditableSpan;