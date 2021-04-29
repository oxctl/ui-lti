import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'

import { storiesOf } from '@storybook/react';

import ErrorBillboard from './ErrorBillboard'

const stories = storiesOf('Components', module);

stories.add('ErrorBillboard', () => {
    return (<ErrorBillboard heading="Test Error Heading" message="Test Message">
          <div> Test Error Billboard  </div>
       </ErrorBillboard>);
})
