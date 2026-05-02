/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;