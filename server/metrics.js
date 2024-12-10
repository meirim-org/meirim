const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { Metadata } = require('@grpc/grpc-js');
const Log = require('./api/lib/log');
const Config = require('config');

const env = process.env.NODE_ENV;
const apikey = Config.get('coralogix.apikey');
const url = Config.get('coralogix.metricsEndpoint');
const serviceName = Config.get('coralogix.serviceName');


const metadata = new Metadata();
metadata.add('Authorization', 'Bearer ' + apikey);

const collectorOptions = {
	url,
	metadata: metadata
};

const metricExporter = new OTLPMetricExporter(collectorOptions);

const meterProvider = new MeterProvider({
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: serviceName,
	}),
});

meterProvider.addMetricReader(new PeriodicExportingMetricReader({
	exporter: metricExporter,
	exportIntervalMillis: 100,
}));

['SIGINT', 'SIGTERM'].forEach(signal => {
	process.on(signal, () => meterProvider.shutdown().catch(console.error));
});

const meter = meterProvider.getMeter('meirim');

const report = async ({ metricName, value = 1, attributes = {} }) => {
	try {
		const h = meter.createHistogram(metricName);
		h.record(value, {
			...attributes,
			env,
		});
	} catch (err) {
		console.error('failed to report metric', err);
	}
};


async function runAndReport({ name, func, timeout = 60 * 60 * 1000 }) {
	try {
		await Promise.race(
			[func(),
				new Promise((resolve, reject) => {
					setTimeout(() => {
						reject(new Error('timeout from runAndReport'));
					}, timeout);
				})]
		);
		report({
			metricName: 'job',
			attributes: { result: 'success', 'job-id': name }
		});
		await new Promise((r) => setTimeout(r, 3000));
		process.exit();
	} catch (e) {
		report({
			metricName: 'job',
			attributes: { result: 'failed', 'job-id': name }
		});
		await new Promise((r) => setTimeout(r, 3000));
		Log.error('failed to run - ', name, e);
		process.exit(1);
	}
}

module.exports = {
	report,
	runAndReport
};
