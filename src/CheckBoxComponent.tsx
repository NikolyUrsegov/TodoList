import React, {ChangeEvent} from 'react';


type CheckBoxComponentPropsType = {
    isDone: boolean
    changeTaskStatus: (isDone: boolean) => void
}
const CheckBoxComponent = (props: CheckBoxComponentPropsType) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(e.currentTarget.checked)
    }
    return (
        <input
            type={'checkbox'}
            onChange={onChangeHandler}
            checked={props.isDone}/>
    );
};

export default CheckBoxComponent;