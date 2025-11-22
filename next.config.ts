/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Permite scripts inline para telemetria do Base Account
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
              "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
