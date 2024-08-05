module.exports = {
  parser: '@typescript-eslint/parser', // Используем парсер для TypeScript
  extends: [
    'eslint:recommended', // Используем рекомендованные правила ESLint
    'plugin:@typescript-eslint/recommended', // Используем рекомендованные правила для TypeScript от @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2020, // Используем последнюю версию ECMAScript
    sourceType: 'module', // Используем ES модули
  },
  rules: {
    // Здесь вы можете добавить свои собственные правила
  },
};
