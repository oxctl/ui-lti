import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'

import { storiesOf } from '@storybook/react';

import LtiApplyTheme from './LtiApplyTheme'

const stories = storiesOf('Components', module);

stories.add('LtiApplyTheme', () => {
    return (<LtiApplyTheme> 
           <div> Test Apply Theme </div>
        </LtiApplyTheme>);
})