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
	experimental: { serverActions: true },
};

module.exports = nextConfig;
