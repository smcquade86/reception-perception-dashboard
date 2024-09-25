/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  trailingSlash: true,
  basePath: isProd ? '/reception-perception-dashboard' : '',
  assetPrefix: isProd ? '/reception-perception-dashboard/' : '',
  // Add any other necessary configurations here
};

export default nextConfig;