import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme } from '@instructure/ui-themeable'

import { storiesOf } from '@storybook/react';

import LtiHeightLimit from './LtiHeightLimit'

const stories = storiesOf('Components', module);

stories.add('LtiHeightLimit', () => {
    return (<LtiHeightLimit>
          <div> Test Height Limit  </div>
       </LtiHeightLimit>);
})
