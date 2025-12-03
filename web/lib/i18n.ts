import fs from 'fs'
import path from 'path'

export async function getTranslations(locale: string) {
  // Load translations from /locales/ folder (single source of truth)
  // Map 'uk' locale to 'ua.json' filename
  const filename = locale === 'uk' ? 'ua.json' : `${locale}.json`
  const file = path.join(process.cwd(), 'locales', filename)
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    // fallback to Ukrainian
    const fallback = path.join(process.cwd(), 'locales', 'ua.json')
    const data = fs.readFileSync(fallback, 'utf-8')
    return JSON.parse(data)
  }
}
