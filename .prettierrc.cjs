/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: ['prettier-plugin-sh'],
  singleQuote: false,
  printWidth: 120,
};

const config = {
  ...prettierConfig,
};

module.exports = config;
