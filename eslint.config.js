import antfu from '@antfu/eslint-config'

export default antfu({
  // Tests use a wide variety of setups; don't enforce the test ruleset.
  test: false,
  ignores: [
    '**/dist',
    '**/.types',
    '**/coverage',
    '**/__screenshots__',
    '**/*.d.ts',
  ],
}, {
  // Node globals are fine in this ESM-only, Node-targeted package.
  rules: {
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
  },
})
