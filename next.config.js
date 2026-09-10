/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nwuanuqblzzikhrpwzwd.supabase.co', pathname: '/storage/v1/object/public/teacher-portraits/**' },
      { protocol: 'https', hostname: 'api.bkend.ai' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
