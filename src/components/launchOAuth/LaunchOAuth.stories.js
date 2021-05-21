import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react';
import { Provider } from "react-redux";
import { ApplyTheme } from '@instructure/ui-themeable'
import LaunchOAuth from './LaunchOAuth'
import configureStore from 'redux-mock-store';


const middlewares = []
const mockStore = configureStore(middlewares)

const mockState1 = {
    userAccess: {
        promptLogin: false
    }
}

const mockState2 = {
    userAccess: {
        promptLogin: true
    }
}
const store1 = mockStore(mockState1)
const store2 = mockStore(mockState2)

const stories = storiesOf('Components', module);

stories.add('LaunchOAuth', () => {
    return (<Fragment>
                <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user does not need login</div>       
                <Provider store={store1}>
                    <LaunchOAuth>
                        <div> Lanuch Auth - Not needed</div>
                    </LaunchOAuth>
                </Provider>
                
                <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user needs login</div>       
                <Provider store={store2}>
                    <LaunchOAuth>
                        <div> Lanuch Auth - This would not be rendered</div>
                    </LaunchOAuth>
                </Provider>
            </Fragment>);
})
