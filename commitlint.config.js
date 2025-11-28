module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Apenas documentação
        'style',    // Formatação, ponto e vírgula, etc
        'refactor', // Refatoração de código
        'perf',     // Melhoria de performance
        'test',     // Adição ou correção de testes
        'build',    // Mudanças no sistema de build
        'ci',       // Mudanças nos arquivos de CI
        'chore',    // Outras mudanças que não modificam src ou testes
        'revert',   // Reverte um commit anterior
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};
