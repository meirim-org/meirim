module.exports = {
  apps: [{
    name: 'api',
    script: 'bin/api',
    merge_logs: true,
    out_file: 'logs/combined.log',
    error_file: 'logs/combined.log',
    cwd: '/path/CitizensForCities',
    env: {
      NODE_ENV: 'production',
    },
    restart_delay: 4000,
  }],
}