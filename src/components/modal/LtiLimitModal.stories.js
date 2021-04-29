import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'

import { storiesOf } from '@storybook/react';

import LtiLimitModal from './LtiLimitModal'

const stories = storiesOf('Components', module);

stories.add('LtiLimitModal', () => {
    return (<LtiLimitModal> 
           <div> Test Limit Modal </div>
        </LtiLimitModal>);
})