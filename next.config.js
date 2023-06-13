/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	async rewrites() {
		return {
			beforeFiles: [],
			afterFiles: [],
			fallback: [
				{
					source: '/:path*',
					destination: '/content/:path*',
				},
			],
		};
	},

	experimental: {
		appDir: true,
		legacyBrowsers: false,
		// Enabled in preperation of release of canary feature.
		// serverComponents: true,
		serverActions: true,
	},
};

module.exports = nextConfig;
