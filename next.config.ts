import { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: { ppr: 'incremental' },
};

module.exports = nextConfig;
