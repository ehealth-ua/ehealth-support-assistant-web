// Custom next/image loader for static export on GitHub Pages.
// next/image does not apply `basePath` to image `src` in export mode,
// so we prepend it here for every image (leaving absolute URLs untouched).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function pagesImageLoader({ src }) {
  if (/^https?:\/\//.test(src)) return src
  return `${basePath}${src.startsWith('/') ? '' : '/'}${src}`
}
