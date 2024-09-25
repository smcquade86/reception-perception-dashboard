/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  trailingSlash: true,
  basePath: isProd ? '/reception-perception-dashboard' : '',
  assetPrefix: isProd ? '/reception-perception-dashboard/' : '',
  output: 'export', // Add this line
  // Add any other necessary configurations here
};

export default nextConfig;