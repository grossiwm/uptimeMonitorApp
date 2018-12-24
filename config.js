/*Create and export configuration variables*/

//Container for all environments
var environments = {};

//Staging (default) environment
environments.staging = {
    'port' : 3000,
    'envName' : 'staging' 
};

//Production Object
environments.production = {
    'port' : 5000,
    'envName' : 'production'
};

//Determine wich is the environment passed by the command line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check if the current environment is one of the defined environments, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;
