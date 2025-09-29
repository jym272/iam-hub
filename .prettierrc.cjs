/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
  language: 'postgresql',
  keywordCase: 'upper',
};

/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: ['prettier-plugin-sh', 'prettier-plugin-sql'],
  singleQuote: true,
  printWidth: 120,
};

const config = {
  ...prettierConfig,
  ...prettierPluginSqlConfig,
};

module.exports = config;
