/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'tailwindcss.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
            }
        ],
    },
    async redirects() {
        return [
            {
                source: '/dashboard',
                destination: '/dashboard/home',
                permanent: true, // Set to true for a 301 redirect, or false for a 302 redirect
            },
        ];
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
