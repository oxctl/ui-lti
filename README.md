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

### `npm run storybook-https`

If you want to run storybook over https this looks for a certificate in `localhost.pem` and a key in `localhost-key.pem`. These are the files used by [mkcert](https://github.com/FiloSottile/mkcert) by default when running `mkcert localhost`.

### `npm run test`

Runs library unit tests

### `npm run build`

Builds a new update of the library.

### `npm run start`



### `npm publish`

To publish the library to NPM so that it would be available for usage

### `npm link`

Before doing this you need to remove any peerDependencies that are in the `node_modules` folder as otherwise you can end up with duplicates in the build and react in particular has problems with this. A quick way to do this is to run:

     npm run remove-peers

This will remove all peerDependencies. When you wish to use storybook again you will need to re-install all the missing dependencies with `npm ci`.

For connecting and debugging at runtime with another repo, this means you don't have to publish changes to npm to use them:

 - in @oxctl/ui-lti
   ```
   npm link
   ```

 - in repo using/testing this library
    ```
    npm link @oxctl/ui-lti
    ```

### Releasing

This library is published to npmjs and to make a new release do:

    npm version minor

This increments the version in `package.json` and creates a git tag. After that's complete perform a build:

    npm run build

And then if it completes ok push the tags and then publish the package:

    git push
    git push --tags
    npm publish
