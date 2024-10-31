import React from 'react';
import LtiLimitModal from './LtiLimitModal.jsx';

const Template = (args) => <LtiLimitModal {...args}/>

export const NoLimit = Template.bind({})
NoLimit.args = {}

export default {
  title: "LtiLimitModal",
  component: LtiLimitModal
}
