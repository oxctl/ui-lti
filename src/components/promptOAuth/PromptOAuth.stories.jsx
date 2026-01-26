import React, { Fragment } from 'react'
import PromptOAuth from "./PromptOAuth";

export default {
  title: 'Components/PromptOAuth',
  component: PromptOAuth,
  tags: ['autodocs']
};

export const Default = {
  render: () => <Fragment>
    <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user needs login</div>
    <PromptOAuth server='https://server.test' needsGrant={true} tokenGranted={()=>{}}/>
  </Fragment>
};