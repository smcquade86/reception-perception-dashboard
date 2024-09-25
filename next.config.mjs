/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  trailingSlash: true,
  basePath: isProd ? '/reception-perception-dashboard' : '',
  assetPrefix: isProd ? '/reception-perception-dashboard/' : '',
  // Remove output: 'export' as it is not needed
};

export default nextConfig;