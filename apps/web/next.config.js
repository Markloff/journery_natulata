
const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')(['ui', 'code-runner']);

const withMDX = require('@next/mdx')(
	{
		extension: /\.mdx?$/,
		options: {
			remarkPlugins: [],
			rehypePlugins: [],
			// If you use `MDXProvider`, uncomment the following line.
			// providerImportSource: "@mdx-js/react",
		},
	}
);

module.exports = withPlugins([
	withTM,
	[withMDX, {
		pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	}]
]);
