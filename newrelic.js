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
  app_name : ['[ripple-rest] api.ripple.com'],
  /**
   * Your New Relic license key.
   */
  license_key : 'REDACTED',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'info'
  },
  error_collector : {
    enabled : true,
   /**
    * Comma-delimited list of HTTP status codes for the error collector to ignore.
    * Defaults to ignore_status_codes : [404] (not found).
    * The NEW_RELIC_ERROR_COLLECTOR_IGNORE_ERROR_CODES environment variable
    * overrides this if used.
    */
    ignore_status_codes : [400, 404]
  }
};
