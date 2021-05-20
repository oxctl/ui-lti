import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'
import { Provider } from "react-redux";
import store from "../../store";
import { storiesOf } from '@storybook/react';

// import LaunchOAuth from './LaunchOAuth'
import {WrappedLaunch0Auth} from './LaunchOAuth'

const stories = storiesOf('Components', module);

stories.add('LaunchOAuth', () => {
    return (<Provider store={store}>
                <WrappedLaunch0Auth needsLogin={true}>
                    <div> Test Height Limit  </div>
                </WrappedLaunch0Auth>
            </Provider>
       );
})
