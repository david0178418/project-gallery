/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		serverActions: true,
		optimizePackageImports: [
			'@mui/icons-material',
			'@mui/material',
			'@mui/styles',
			'@mui/lab',
			'date-fns',
		],
	},
};

module.exports = nextConfig;
