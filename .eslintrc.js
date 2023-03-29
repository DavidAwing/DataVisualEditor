module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/no-var-requires': 0,
    "space-before-function-paren": 0,
    '@typescript-eslint/no-empty-function': 0,
    "padded-blocks": 0,
    '@typescript-eslint/no-unused-vars': 'off',
    "@typescript-eslint/no-explicit-any": ["off"],
    'no-multiple-empty-lines': 0,
    // 关闭驼峰命名规则
    'vue/multi-word-component-names': 0,
    '@typescript-eslint/no-this-alias': ["off"],
    'lines-between-class-members': ["off"],
    'indent': ['off', 2],
    'camelcase': 'off',
    'spaced-comment': 'off',
    'no-empty': 'off',
    'key-spacing': 'off',
    'prefer-const': 'off',
    'comma-spacing': 'off',
    'curly': 'off',
    'new-cap': 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
    'eqeqeq': 'off',
    'brace-style': 'off',
    'no-multi-spaces': 'off',
    'yoda': 'off',
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    'no-lone-blocks': 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
