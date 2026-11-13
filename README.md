# UI LTI

This project was created as a central repository for common UI components that help when building LTI tools that plugin to the [Canvas LMS](https://www.instructure.com/en-gb/canvas) and build upon the [Instructure UI](https://instructure.design/) component library.

**Note:** This library's major version matches the major version of Instructure UI that it depends on. For example, version `10.x.x` of this library requires Instructure UI `10.x` packages as peer dependencies.

[![Node.js CI](https://github.com/oxctl/ui-lti/actions/workflows/node.js.yml/badge.svg)](https://github.com/oxctl/ui-lti/actions/workflows/node.js.yml)

## Using this library

This library is published to npmjs: https://www.npmjs.com/package/@oxctl/ui-lti
If you want to add this library to your React tool you can add it with:

    npm install --save @oxctl/ui-lti

### Canvas page settings

`LtiPageSettings` retrieves Canvas page settings and applies branding and
high-contrast themes. It also supports OpenDyslexic, controlled by the
optional `useDyslexicFont` boolean prop (default `false`):

```jsx
import { LtiPageSettings } from '@oxctl/ui-lti'

<LtiPageSettings useDyslexicFont={dyslexicFontPreference === 'true'}>
  <App />
</LtiPageSettings>
```

In this example, `dyslexicFontPreference` is the string value provided by your
application's LTI launch configuration using `Canvas.user.prefersDyslexicFont`.

### OpenDyslexic font

Enable `useDyslexicFont` on `LtiPageSettings` to use OpenDyslexic for descendant
HTML and Instructure UI components, including Instructure components rendered in portals.
The library bundles OpenDyslexic regular, bold, italic, and bold-italic fonts,
so no font URLs or external font service are needed. Each variant is registered
with its matching weight (400 or 700) and style (normal or italic), so `<b>`,
`<strong>`, `<i>`, `<em>`, and their combinations use the actual font variants.

The component preserves branding and high-contrast settings. It adds a `div`
around its children, even when disabled, and overrides their
font families, including explicit styles on form controls. The browser uses
sans-serif until the requested font variant loads. The bundled fonts are separate
assets, not embedded in JavaScript. Their font-face definitions are always
present, but the browser downloads only variants it uses. Your application build must
resolve `?url` font imports and serve the emitted font files (Vite supports
this by default); permit their origin in your Content Security Policy's
`font-src`.

Each optional URL prop overrides just its matching variant; omitted URLs use
the corresponding bundled fonts:

```jsx
<LtiPageSettings
  useDyslexicFont
  fontUrl="/fonts/OpenDyslexic-Regular.woff2"
  boldFontUrl="/fonts/OpenDyslexic-Bold.woff2"
  italicFontUrl="/fonts/OpenDyslexic-Italic.woff2"
  boldItalicFontUrl="/fonts/OpenDyslexic-BoldItalic.woff2"
>
  <App />
</LtiPageSettings>
```

The bundled fonts are from
[`@fontsource/opendyslexic` 5.3.0](https://www.npmjs.com/package/@fontsource/opendyslexic/v/5.3.0)
and are redistributed under the
[SIL Open Font License 1.1](src/components/LtiPageSettings/fonts/LICENSE).

The optional `useDyslexicFont` prop defaults to `false`, leaving the surrounding theme
and child fonts unchanged without applying the font. Set it to `true` to
apply OpenDyslexic.
Toggling it preserves child state and keeps the wrapper `div` in place.
The component does not detect Canvas preferences; the consuming application can
pass the user's dyslexia-font preference as `useDyslexicFont`. Plain HTML rendered into
a portal outside the component, shadow roots, and iframe contents are not affected
by its descendant styles.

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
