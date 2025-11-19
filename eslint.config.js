import { antfu } from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['.github'],
    type: 'lib',
    formatters: true,
    lessOpinionated: true,
  },
  {
    rules: {
      // 顶级函数必须使用 function 定义
      'antfu/top-level-function': ['error'],

      // 箭头函数参数括号与 prettier 保持一致
      'style/arrow-parens': ['error', 'always'],
      // 花括号必须在换行
      'style/curly-newline': ['error', 'always'],

      'style/operator-linebreak': [
        'error',
        'after',
        {
          overrides: {
            '?': 'before',
            ':': 'before',
            // 避免 `=` 后的 `/* @__PURE__ */` 被移动
            '=': 'ignore',
          },
        },
      ],
    },
  },
  {
    files: ['.scripts/**/*'],
    rules: {
      'no-console': 'off',
      'antfu/no-top-level-await': 'off',
    },
  },
)
