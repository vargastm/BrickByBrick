/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' *",
            ].join('; '),
          },
        ],
      },
    ]
  },
  webpack: (config: any) => {
    config.module = config.module || {}
    config.module.rules = config.module.rules || []

    config.module.rules.push({
      test: /node_modules\/thread-stream\/test/,
      use: 'ignore-loader',
    })

    config.module.rules.push({
      test: /\.(md|zip|sh|test\.js|test\.mjs|bench\.js|LICENSE)$/,
      include: /node_modules/,
      use: 'ignore-loader',
    })

    return config
  },
  turbopack: {},
}

module.exports = nextConfig
