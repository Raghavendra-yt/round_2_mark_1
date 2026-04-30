// Babel configuration for Jest (transforms ESM + JSX)
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
