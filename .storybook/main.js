const config = {
  // Required
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Optional
  addons: [
    '@storybook/addon-essentials'
  ],
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};
export default config;