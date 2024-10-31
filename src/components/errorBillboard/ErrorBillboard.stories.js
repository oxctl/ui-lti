import React from 'react';

import ErrorBillboard from './ErrorBillboard.jsx';

const Template = (args) => <ErrorBillboard {...args}/>

export const NoError = Template.bind({})
NoError.args = {
    heading: null,
    message: null
}

export const HeadingOnly = Template.bind({})
HeadingOnly.args = {
    heading: "Test Heading",
}

export const MessageOnly = Template.bind({})
MessageOnly.args = {
    message: "Test Message"
}


export const MessageAndHeading = Template.bind({})
MessageAndHeading.args = {
    heading: "Test Heading",
    message: "Test Message"
}

export default {
    title: "ErrorBillboard",
    component: ErrorBillboard,
    args: {
        children: <div>Normal content that should be displayed</div>
    },
}

