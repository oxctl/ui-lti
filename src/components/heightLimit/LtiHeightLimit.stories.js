import React from 'react';
import LtiHeightLimit from './LtiHeightLimit';

const Template = () => <LtiHeightLimit>
      <div> Test Height Limit </div>
    </LtiHeightLimit>

export const Default = Template.bind({})
Default.args = {}

export default {
    title: "LtiHeightLimit",
    component: LtiHeightLimit
}
