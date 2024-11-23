/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启 Turbopack
  experimental: {
    turbo: true,
    // 优化构建追踪
    turbotrace: {
      logLevel: "error",
      logDetail: true
    }
  },

  // 开启 SWC 编译器优化
  swcMinify: true,

  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev) {
      config.optimization.minimize = true;
    }
    return config;
  },

  // 配置构建输出
  output: 'standalone',

  // 优化图片处理
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // CORS 配置
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:5173",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;
