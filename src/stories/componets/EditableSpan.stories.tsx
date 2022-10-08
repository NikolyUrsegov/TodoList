import React from 'react'
import {action} from '@storybook/addon-actions'
import EditableSpan from "../../components/EditableSpan";

export default {
    title: 'EditableSpan Stories',
    component: EditableSpan
}

const onChange = ( title: string) => action("value changed")

export const EditableSpanFormBaseExample = (props: any) => {
    return (<EditableSpan title={"StartValue"} changeTask={action("value changed")} />)
}
