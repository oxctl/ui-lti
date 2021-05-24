import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react';
import { ApplyTheme } from '@instructure/ui-themeable'
import LaunchOAuth from './LaunchOAuth'

const stories = storiesOf('Components', module);

stories.add('LaunchOAuth', () => {
    return (<Fragment>
                <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user does not need login</div>       
                    <LaunchOAuth server={{}} promptLogin={false}>
                        <div> Lanuch Auth - Not needed</div>
                    </LaunchOAuth>
                
                <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user needs login</div>       
                    <LaunchOAuth server={{}} promptLogin={true}>
                        <div> Lanuch Auth - This would not be rendered</div>
                    </LaunchOAuth>
            </Fragment>);
})
