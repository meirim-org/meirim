module.exports = {
	apps: [{
		name: 'meirim',
		script: 'bin/serve',
		merge_logs: true,
		out_file: 'logs/combined.log',
		error_file: 'logs/combined.log',
		cwd: '/path/meirim/server',
		env: {
			NODE_ENV: 'production',
		},
		restart_delay: 4000,
	}],
};
