import React, { Fragment } from 'react'
import LaunchOAuth from './LaunchOAuth.jsx'

export default {
  title: 'Components/LaunchOAuth',
  component: LaunchOAuth,
  tags: ['autodocs']
};

export const Default = {
  render: () => <Fragment>
    <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user does not need login</div>
    <LaunchOAuth server={{}} promptLogin={false}>
      <div> Launch Auth - Not needed</div>
    </LaunchOAuth>

    <div style={{fontWeight: "bold", paddingTop: "5px"}}> When user needs login</div>
    <LaunchOAuth server={{}} promptLogin={true}>
      <div> Launch Auth - This would not be rendered</div>
    </LaunchOAuth>
  </Fragment>
};