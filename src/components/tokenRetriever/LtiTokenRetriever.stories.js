import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'

import { storiesOf } from '@storybook/react';

import LtiTokenRetriever from './LtiTokenRetriever'

const stories = storiesOf('Components', module);

stories.add('LtiTokenRetriever', () => {
    return (<LtiTokenRetriever> 
           <div> Test Token Retriever </div>
        </LtiTokenRetriever>);
})