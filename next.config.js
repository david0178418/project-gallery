/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: { domains: ['localhost'] },
	experimental: {
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
