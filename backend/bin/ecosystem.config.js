module.exports = {
  apps : [{
    name        : "api",
    script      : "./bin/www",
    watch       : true,
    env: {
      "NODE_ENV": "production",
    }
  }]
}
