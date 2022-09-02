import React, {ChangeEvent, memo} from 'react';
import {TaskStatuses} from "../api/todolists-api";


type CheckBoxComponentPropsType = {
    status: TaskStatuses
    changeTaskStatus: (isDone: boolean) => void
    disabled?: boolean
}
const CheckBoxComponent = memo((props: CheckBoxComponentPropsType) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(e.currentTarget.checked)
    }
    return (
        <input
            type={'checkbox'}
            onChange={onChangeHandler}
            checked={props.status === TaskStatuses.Completed}
            disabled={props.disabled}
        />
    );
});

export default CheckBoxComponent;