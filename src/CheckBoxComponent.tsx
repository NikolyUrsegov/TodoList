import React, {ChangeEvent, memo} from 'react';


type CheckBoxComponentPropsType = {
    isDone: boolean
    changeTaskStatus: (isDone: boolean) => void
}
const CheckBoxComponent = memo((props: CheckBoxComponentPropsType) => {
    console.log('CheckBoxComponent')
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(e.currentTarget.checked)
    }
    return (
        <input
            type={'checkbox'}
            onChange={onChangeHandler}
            checked={props.isDone}/>
    );
});

export default CheckBoxComponent;