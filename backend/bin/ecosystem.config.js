module.exports = {
  apps : [{
    name        : "api",
    script      : "./www",
    watch       : true,
    env: {
      "NODE_ENV": "production",
    }
  }]
}
