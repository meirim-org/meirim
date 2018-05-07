module.exports = {
  apps: [{
    name: 'api',
    script: 'bin/api',
    watch: true,
    env: {
      'NODE_ENV': 'production',
      'PORT': 3000
    }
  }]
}