module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Allow console.log for debugging (common in serverless functions)
    'no-console': 'off',

    // Allow unused variables that start with underscore
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Allow dangling underscores for private variables
    'no-underscore-dangle': 'off',

    // Allow file extensions in imports (ES modules)
    'import/extensions': 'off',

    // Allow parameter reassignment (common in event handlers)
    'no-param-reassign': 'off',

    // Allow nested ternary (sometimes cleaner than if-else chains)
    'no-nested-ternary': 'off',

    // Allow ++ operator
    'no-plusplus': 'off',

    // Allow for-of loops
    'no-restricted-syntax': 'off',

    // Allow await in loops (sometimes necessary)
    'no-await-in-loop': 'off',

    // Allow empty blocks (common in try-catch)
    'no-empty': 'off',

    // Allow variable shadowing (common in nested functions)
    'no-shadow': 'off',

    // Allow consistent return (async functions can return undefined)
    'consistent-return': 'off',

    // Allow alert (for debugging)
    'no-alert': 'off',

    // Allow radix parameter (parseInt is fine without radix for our use case)
    radix: 'off',

    // Allow isNaN (Number.isNaN is not always available)
    'no-restricted-globals': 'off',

    // Allow promise executor return
    'no-promise-executor-return': 'off',

    // Allow loss of precision (for test numbers)
    'no-loss-of-precision': 'off',

    // Allow function hoisting
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],

    // Prefer const over let, but allow let when reassigning
    'prefer-const': 'error',

    // Require consistent quotes
    quotes: ['error', 'single', { avoidEscape: true }],

    // Require semicolons
    semi: ['error', 'always'],

    // Indentation
    indent: ['error', 2],

    // Line endings (allow both Unix and Windows)
    'linebreak-style': 'off',

    // Trailing commas
    'comma-dangle': ['error', 'always-multiline'],

    // Object curly spacing (let Prettier handle this)
    'object-curly-spacing': 'off',
    'object-curly-newline': 'off',
    
    // Array bracket spacing (let Prettier handle this)
    'array-bracket-spacing': 'off',

    // Max line length
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // Import order
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Prefer template literals
    'prefer-template': 'error',

    // Arrow function preferences (let Prettier handle this)
    'arrow-spacing': 'off',
    'arrow-parens': 'off',

    // Object destructuring
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],

    // Async/await preferences
    'no-async-promise-executor': 'error',

    // Security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Best practices
    eqeqeq: ['error', 'always'],
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // Code style (let Prettier handle most of these)
    'brace-style': 'off',
    camelcase: ['error', { properties: 'never' }],
    'new-cap': ['error', { newIsCap: true, capIsNew: false }],
    'no-multiple-empty-lines': 'off',
    'no-trailing-spaces': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'space-unary-ops': 'off',
    'spaced-comment': ['error', 'always'],
    'operator-linebreak': 'off',
  },
  overrides: [
    {
      // Test files
      files: ['tests/**/*.js', '**/*.test.js'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        // Allow longer lines in tests for readability
        'max-len': [
          'error',
          {
            code: 150,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
          },
        ],

        // Allow unused variables in tests (for mocking)
        'no-unused-vars': 'off',

        // Allow any in tests for mocking
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      // API files (serverless functions)
      files: ['api/**/*.js'],
      rules: {
        // Allow require in serverless functions
        'import/no-extraneous-dependencies': 'off',

        // Allow process.env usage
        'no-process-env': 'off',
      },
    },
    {
      // Client-side files
      files: ['public/**/*.js'],
      env: {
        browser: true,
        node: false,
      },
      rules: {
        // Allow global variables in browser environment
        'no-undef': 'off',
      },
    },
  ],
};
