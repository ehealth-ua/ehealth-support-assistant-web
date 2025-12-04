import notebooks from "../../../config/notebooks.json";
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getTranslations } from '../../../lib/i18n';

type NotebookItem = {
  slug: string;
  title: string;
  description?: string;
  links?: { label: string; url: string; image?: string }[];
  instructions?: string[];
};

export function generateStaticParams() {
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : [];
  return items.map((n) => ({ slug: n.slug }));
}

export default async function RegisterDetail({ params }: { params: { slug: string } }) {
  const c = cookies().get('NEXT_LOCALE');
  const locale = c?.value ?? 'uk';
  const t = await getTranslations(locale);
  
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : [];
  const item = items.find((n) => n.slug === params.slug);

  if (!item) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>{t.registryPage?.notFound || 'Реєстр не знайдено'}</h1>
        <p>{t.registryPage?.checkSlug || 'Перевірте, що slug існує у web/config/notebooks.json.'}</p>
      </main>
    );
  }

  // Get translated title from registryCards
  const translatedTitle = t.registryCards?.[item.slug as keyof typeof t.registryCards] || item.title;

  return (
    <>
      <div
        className="w-full h-32 bg-cover bg-top relative"
        style={{
          backgroundImage: "url('/images/Hero_ezdorovya.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">{translatedTitle}</h1>
        </div>
      </div>
      <main style={{ padding: "24px" }}>
        {item.description && <p>{item.description}</p>}

      <section style={{ display: "grid", gap: 24, maxWidth: 920 }}>
        {(item.links || []).map((link) => {
          const isSupport = link.label === 'Підтримка користувачів';
          const imgSize = isSupport ? 320 : 480;
          // Translate "Підтримка користувачів" label using locales
          const translatedLabel = isSupport 
            ? (t.registryPage?.userSupport || link.label)
            : link.label;
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                textDecoration: "none",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{translatedLabel}</h3>
              {link.image && (
                <Image
                  src={link.image}
                  alt={translatedLabel}
                  width={imgSize}
                  height={imgSize}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              )}
            </a>
          );
        })}
      </section>

      {item.instructions && item.instructions.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2>{t.registryPage?.instructions || 'Інструкції'}</h2>
          <ul>
            {item.instructions.map((href) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {href}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      </main>
    </>
  )
}
