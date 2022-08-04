import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {TextField, IconButton} from "@material-ui/core";
import {AddCircle} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (value: string) => void
}

const AddItemForm = memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string>('')

    const onAddTaskClickHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        error && setError('')
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAddTaskClickHandler()
        }
    }


    return (
        <div>
            <TextField
                variant={'outlined'}
                value={title}
                error={!!error}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                label={'Task'}
                helperText={error}
            />
            <IconButton color={'primary'} onClick={onAddTaskClickHandler}>
                <AddCircle/>
            </IconButton>
        </div>
    );
})

export default AddItemForm;