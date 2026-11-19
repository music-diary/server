// Supply connection settings through the process environment or deployment platform.
module.exports = {
  apps: [
    {
      name: 'muda-api',
      script: './dist/main.js',
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
