// Static export for GitHub Pages (project site served under a sub-path).
const basePath = '/ehealth-support-assistant-web'

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  basePath,
  assetPrefix: basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

module.exports = nextConfig
