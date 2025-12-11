import notebooks from "../../../config/notebooks.json";
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getTranslations } from '../../../lib/i18n';
import { UserSupportContent } from '../../components/UserSupportContent';

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
  
  // Get registry details from translations
  const registryDetails = t.registryDetails?.[item.slug as keyof typeof t.registryDetails];
  const translatedDescription = registryDetails?.description || item.description;
  const translatedCommentary = registryDetails?.commentary || '';
  const translatedAnalyticsTitle = registryDetails?.analyticsTitle || '';
  const userSupportText = registryDetails?.userSupportText as {
    intro?: string;
    chatsLabel?: string;
    orText?: string;
    formText?: string;
    faqIntro?: string;
    faqItems?: string[];
    instructionsText?: string;
    links?: { label: string; href: string }[];
  } | undefined;

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
        {translatedDescription && <p style={{ marginBottom: 24, fontSize: '1.1rem', lineHeight: 1.6 }}>{translatedDescription}</p>}

      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24, 
        maxWidth: 1100 
      }}>
        {(item.links || []).map((link, index) => {
          const isSupport = link.label === 'Підтримка користувачів';
          const isAnalytics = index === 0 && !isSupport; // First link is typically the analytics module
          // Analytics module images reduced by 20% (480 -> 384), support cards remain at 320
          const imgSize = isSupport ? 320 : 384;
          
          // Translate labels using locales
          let translatedLabel = link.label;
          if (isSupport) {
            translatedLabel = t.registryPage?.userSupport || link.label;
          } else if (isAnalytics && translatedAnalyticsTitle) {
            translatedLabel = translatedAnalyticsTitle;
          }
          
          return (
            <div
              key={link.url}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline", color: "#0066cc" }}
              >
                <span style={{ display: 'block', marginTop: 0, marginBottom: 16, fontSize: '1.17em', fontWeight: 'bold' }}>{translatedLabel}</span>
              </a>
              {link.image && (
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', alignSelf: 'center', marginBottom: 16 }}>
                  <Image
                    src={link.image}
                    alt={translatedLabel}
                    width={imgSize}
                    height={imgSize}
                    style={{ objectFit: 'cover', borderRadius: 8, width: imgSize, height: imgSize }}
                  />
                </a>
              )}
              {isAnalytics && translatedCommentary && (
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#444' }}>
                  {translatedCommentary}
                </p>
              )}
              {isSupport && userSupportText && typeof userSupportText === 'object' && (
                <UserSupportContent userSupportText={userSupportText} />
              )}
            </div>
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
