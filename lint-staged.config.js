/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,jsx,cjs,mjs,ts,tsx,html,vue,css,scss,json,json5,jsonc,md}': [
    'prettier --write',
    'eslint --fix',
  ],
}
