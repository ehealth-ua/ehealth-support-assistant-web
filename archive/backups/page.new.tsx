import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getTranslations } from '../../lib/i18n';

interface Registry {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage?: string;
}

async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'web', 'config', 'notebooks.json');
  try {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export default async function RegistersPage() {
  const c = cookies().get('NEXT_LOCALE');
  const locale = c?.value ?? 'uk';
  const t = await getTranslations(locale);

  const registries = await loadRegistries();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t.catalogTitle}</h1>
      <p className="text-gray-600">{t.heroSubtitle}</p>

      <section>
        <div className="w-full h-[70vh] border rounded overflow-hidden">
          <iframe src="https://ekoppho.instatus.com" className="w-full h-full" title="Instatus" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-6">{t.catalogTitle}</h2>
        {registries.length === 0 ? (
          <p className="text-red-600">{t.registersNotFound}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {registries.map((r) => (
              <Link key={r.slug} href={`/registers/${r.slug}`} className="block border rounded p-4 hover:shadow">
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{r.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
