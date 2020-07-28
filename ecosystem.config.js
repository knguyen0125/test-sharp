module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.',
	  instances: 2,
	  env: {
		  // "UV_THREADPOOL_SIZE": 1,

		}
  }],
};
