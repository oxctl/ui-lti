# UI LTI

This project was created as a central repository for common UI components that help when building LTI tools that plugin to the [Canvas LMS](https://www.instructure.com/en-gb/canvas) and build upon the [Instructure UI](https://instructure.design/) component library.

**Note:** This library's major version matches the major version of Instructure UI that it depends on. For example, version `10.x.x` of this library requires Instructure UI `10.x` packages as peer dependencies.

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

### Local Testing

It's helpful to be able to test this library locally before releasing. To do this first bundle up the library:

```bash
npm run build && npm pack --pack-destination /tmp
```

This will put a copy of build into `/tmp` you can then "upgrade" a project to use this local copy by running:

```bash
npm install /tmp/oxctl-ui-lti-10.0.2.tgz
```

This command references the current version of the package so will need changing as the package version increments. If a
change is made in the future to the library and this needs to be re-rested all these commands need to be re-run to get
an updated version of the library available in the project that is testing it.

### Releasing

This library is published to npmjs and to make a new release do:

    npm version minor

And then if it completes ok push the tags and GitHub actions will build and publish the package to npmjs.

    git push
    git push --tags
