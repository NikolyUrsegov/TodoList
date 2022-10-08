import React from 'react'
import {action} from '@storybook/addon-actions'
import StoryRouter from 'storybook-react-router';
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from "../decorators/ReduxStoreProviderDecorator";
import App from "../../app/App";

export default {
    title: 'Application Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]
}

export const AppBaseExample = (props: any) => {
    return (<App demo={true} />)
}
