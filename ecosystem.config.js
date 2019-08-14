module.exports = {
  apps: [{
    name: 'serve',
    script: 'bin/serve',
    merge_logs: true,
    out_file: 'logs/combined.log',
    error_file: 'logs/combined.log',
    cwd: '/home/bambi/CitizensForCities',
    env: {
      NODE_ENV: 'production',
    },
    restart_delay: 4000,
  }],
};
