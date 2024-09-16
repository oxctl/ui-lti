import React, { Fragment } from 'react'
import { storiesOf } from '@storybook/react';
import PromptOAuth from "./PromptOAuth";

const stories = storiesOf('Components', module);

stories.add('PromptOAuth', () => {
    return (<Fragment>
                <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user needs login</div>       
                    <PromptOAuth server='https://server.test' needsGrant={true} tokenGranted={()=>{}}/>
            </Fragment>);
})
