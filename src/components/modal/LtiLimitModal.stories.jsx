import React from 'react';
import LtiLimitModal from './LtiLimitModal';

const Template = (args) => <LtiLimitModal {...args}/>

export const NoLimit = Template.bind({})
NoLimit.args = {}

export default {
  title: "Components/LtiLimitModal",
  component: LtiLimitModal,
  tags: ['autodocs']
}
