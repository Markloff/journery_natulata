const withNextra = require('nextra')('nextra-theme-docs', './theme.config.js')

const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')(['ui']);


module.exports = withPlugins([
	withTM,
	withNextra
]);
