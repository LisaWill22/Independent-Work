'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
	/**
	 * Array of application names.
	 */
	app_name: ['Launchpeer - IW'],
	/**
	 * Your New Relic license key.
	 */
	license_key: '3aff645173d3e4b60e5b23d4082d67abf169538f',
	logging: {
		/**
		 * Level at which to log. 'trace' is most useful to New Relic when diagnosing
		 * issues with the agent, 'info' and higher will impose the least overhead on
		 * production applications.
		 */
		level: 'info'
	}
}
