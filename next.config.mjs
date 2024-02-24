/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    // const ossURL = 'https://lsnx.oss-cn-chengdu.aliyuncs.com/image/photowall'
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lsnx.oss-cn-chengdu.aliyuncs.com'
        }]
    },

};

export default nextConfig;
