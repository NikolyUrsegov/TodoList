import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Task from '../../Task';
import {action} from "@storybook/addon-actions";
import {TaskType} from "../../state/tasks-reducer";


export default {
    title: 'TODOLISTS/Task',
    component: Task
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => {
    const [task, setTask] = useState<TaskType>(args.task)
    return <Task
        task={task}
        changeTaskTitle={(taskId: string, newTitle: string) => setTask({...task, title: newTitle})}
        changeTaskStatus={(id: string, isDone: boolean) => setTask({...task, isDone: isDone})}
        removeTask={action('remove task')}
    />
};

export const TaskIsDone = Template.bind({});
TaskIsDone.args = {
    task: {id: '1', title: 'HTML', isDone: true}
};
export const TaskIsNotDone = Template.bind({});
TaskIsNotDone.args = {
    task: {id: '1', title: 'HTML', isDone: false}
};


