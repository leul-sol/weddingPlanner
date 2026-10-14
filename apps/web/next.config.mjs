/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@wedlink/shared'],
  async rewrites() {
    // Proxy API calls to the NestJS backend so cookies share the origin in dev.
    const api = process.env.API_PROXY_URL ?? 'http://localhost:4100';
    return [{ source: '/api/:path*', destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
