
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize();

export const loaders = [mswLoader];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}