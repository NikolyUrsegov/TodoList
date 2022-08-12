import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import EditableSpan from "../../EditableSpan";



export default {
    title: 'TODOLISTS/EditableSpan',
    component: EditableSpan,
    argTypes: {
        title: {
            defaultValue: 'Html',
            description: 'Start value'
        },
        changeTask: {
            description: 'on change clicked'
        }

    },
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanEx = Template.bind({});
EditableSpanEx.args = {
    changeTask: action('on change clicked')
};

