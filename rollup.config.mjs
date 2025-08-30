import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/better_teams.js',
  output: {
    file: 'dist/better_teams.bundle.js',
    format: 'iife',
    name: 'BetterTeams',
  },
  plugins: [
    nodeResolve()
  ]
};
