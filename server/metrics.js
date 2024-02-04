
const { CloudWatchClient, PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch"); // CommonJS import
const client = new CloudWatchClient();
const env = process.env.NODE_ENV

// [
//     {
//       Name: "UNIQUE_PAGES",
//       Value: "URLS",
//     },
//   ]
const report = async ({ metricName, unit = "None", value = 1.0, dims = [] }) => {
    // See https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html#API_PutMetricData_RequestParameters
    // and https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html
    // for more information about the parameters in this command.
    const command = new PutMetricDataCommand({
      MetricData: [
        {
          MetricName: metricName,
          Dimensions: [...dims, { Name: "environment", Value: env }],
          Unit: unit,
          Value: value,
        },
      ],
      Namespace: "meirim",
    });

    try {
      await client.send(command);
    } catch (err) {
      console.error("failed to report metric", err);}
    };


async function runAndReport({name, func}) {
    try {
        const res = await func()
        report({ 
            metricName: "job",
            dims: [
                {
                    Name: "result",
                    Value: "success",
                },
                {
                    Name: "component",
                    Value: name,
                },
            ]
        })
        return res
    } catch (e) {
        report({ 
            metricName: "job",
            dims: [
                {
                    Name: "result",
                    Value: "failed",
                },
                {
                    Name: "component",
                    Value: name,
                },
            ]
        })
        throw e
    }
} 

module.exports = {
    report,
    runAndReport
}