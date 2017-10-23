module.exports = {
  apps : [{
    name        : "api",
    script      : "bin/www",
    watch       : true,
    cwd         : "backend/",
    env: {
      "NODE_ENV": "production",
      "PORT":3000
    }
  },
  // {
  //   name        : "client",
  //   script      : "node_modules/react-server-cli/target/cli.js",
  //   watch       : true,
  //   cwd         : "client/",
  //   args   : 'start',
  //   ignore_watch: '__clientTemp',
  //   env: {
  //     "NODE_ENV": "production",
  //     REACT_SERVER_CONFIGS: "_configs/production/",
  //     "PORT":3001
  //   }
  // }
]
}
