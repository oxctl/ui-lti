# UI LTI

This project was created as a central repository for common UI components that help when building LTI tools that plugin to the [Canvas LMS](https://www.instructure.com/en-gb/canvas) and build upon the [Instructure UI](https://instructure.design/) component library.

[![Node.js CI](https://github.com/oxctl/ui-lti/actions/workflows/node.js.yml/badge.svg)](https://github.com/oxctl/ui-lti/actions/workflows/node.js.yml)

## Using this library

This library is published to npmjs: https://www.npmjs.com/package/@oxctl/ui-lti
If you want to add this library to your React tool you can add it with:

    npm install --save @oxctl/ui-lti


## Available Scripts

In the project directory, you can run:

### `npm run storybook`

Runs storybook to show a demo of the components in the library

### `npm run test`

Runs library unit tests

### `npm build-lib`

Builds a new update of the library.

### `npm publish`

To publish the library to NPM so that it would be available for usage

### `npm link`
 For connecting and debugging at runtime with another repo
 - in @oxctl/ui-lti
    - npm link

- in parent repo
    - npm link @oxctl/ui-lti
    - npm link ../ui-lti/node_module/react
    - npm link ../ui-lti/node_module/react-dom


### importing LtiApplyTheme
when impoting LtiApplyTheme, the default theme is the new theme, so any import that requires the older version would have to have to pass in a version props of 'Old'
