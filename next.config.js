module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.infura.io', 'ipfs.moralis.io'],
    formats: ['image/webp', 'image/jpeg', 'image/png'],
  },
  experimental: { esmExternals: true }
}

// next.config.js
const removeImports = require('next-remove-imports')();
module.exports = removeImports({});

