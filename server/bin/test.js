const { report } = require('../metrics')

async function main() {
    await report({metricName: "test-job", attributes: {"label": "nana"} })
    console.log("here")
}

main()