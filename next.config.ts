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
              "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org https://eth.merkle.io https://*.merkle.io https://*.infura.io https://*.alchemy.com https://*.quicknode.com https://*.coinbase.com https://*.base.org wss://*.eth.merkle.io",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
