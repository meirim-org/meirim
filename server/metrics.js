
const { CloudWatchClient, PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch"); // CommonJS import
const client = new CloudWatchClient();

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
          Dimensions: dims,
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


async function runAndReport({metricName, func}) {
    try {
        const res = await func()
        report({ 
            metricName,
            dims: [
                {
                    Name: "result",
                    Value: "success",
                }
            ]
        })
        return res
    } catch (e) {
        report({ 
            metricName,
            dims: [
                {
                    Name: "result",
                    Value: "failed",
                }
            ]
        })
        throw e
    }
} 

module.exports = {
    report,
    runAndReport
}