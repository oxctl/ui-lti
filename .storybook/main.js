module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],

  docs: {
    autodocs: true
  },

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  features: {
    storyStoreV7: false,
  },
}