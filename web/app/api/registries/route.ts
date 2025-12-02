import fs from 'fs'
import path from 'path'

interface Registry {
  slug: string
  title: string
  description: string
  links?: { label: string; url: string; image?: string }[]
}

export async function GET() {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    const registries: Registry[] = JSON.parse(data)
    // Return only slug and title for header menu
    const simplified = registries.map(r => ({ slug: r.slug, title: r.title }))
    return Response.json(simplified)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}
