module.exports = {
  apps : [{
    name        : "Meirim API",
    script      : "./www",
    watch       : true,
    env: {
      "NODE_ENV": "production",
    }
  }]
}
