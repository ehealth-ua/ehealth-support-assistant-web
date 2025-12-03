import fs from 'fs'
import path from 'path'

export async function getTranslations(locale: string) {
  // When running from the `web` folder, process.cwd() already points to that folder.
  // Use a path relative to the current working directory so we don't end up with `web/web/i18n`.
  const file = path.join(process.cwd(), 'i18n', `${locale}.json`)
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    // fallback to uk
    const fallback = path.join(process.cwd(), 'locales', `ua.json`)
    const data = fs.readFileSync(fallback, 'utf-8')
    return JSON.parse(data)
  }
}
