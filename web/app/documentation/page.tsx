"use client"
import DocumentCard from '../components/DocumentCard';
import { useTranslations } from '../../lib/useTranslations';

interface Document {
  key: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  filePath?: string;
  fileSize?: string;
}

// Document keys mapped to file paths
const documents: Document[] = [
  {
    key: 'promptTechniques',
    fileType: 'PDF',
    filePath: '/docs/prompt-techniques.pdf',
    fileSize: '2.5 MB',
  },
  {
    key: 'prompting',
    fileType: 'PDF',
    filePath: '/docs/prompting.pdf',
    fileSize: '1.8 MB',
  },
  {
    key: 'ekTeamsChecklist',
    fileType: 'DOCX',
    filePath: '/docs/ek-teams-checklist.docx',
    fileSize: '0.5 MB',
  },
  {
    key: 'dzrReference',
    fileType: 'XLSX',
    filePath: '/docs/dzr-reference.xlsx',
    fileSize: '1.2 MB',
  },
  {
    key: 'ekopfoDatabaseModel',
    fileType: 'IMG',
    filePath: '/images/EKOPFO database model.png',
    fileSize: '0.8 MB',
  },
  {
    key: 'statusModelCase',
    fileType: 'IMG',
    filePath: '/images/Model_1_maintrack.svg',
    fileSize: '0.2 MB',
  },
  {
    key: 'statusModelVector',
    fileType: 'IMG',
    filePath: '/images/Model_2_skarga.svg',
    fileSize: '0.2 MB',
  },
  {
    key: 'statusModelImage',
    fileType: 'IMG',
    filePath: '/images/Статус-модель картинка.jpg',
    fileSize: '0.7 MB',
  },
  {
    key: 'document9',
    fileType: 'PDF',
  },
  {
    key: 'document10',
    fileType: 'DOCX',
  },
  {
    key: 'document11',
    fileType: 'IMG',
  },
  {
    key: 'document12',
    fileType: 'XLSX',
  },
];

export default function DocumentationPage() {
  const { t } = useTranslations();

  const getCardTranslation = (key: string) => {
    const cards = t.documentation?.cards as Record<string, { title: string; description: string }> | undefined;
    return cards?.[key] || { title: key, description: '' };
  };

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
          <h1 className="text-5xl font-bold text-white text-center">{t.documentation?.title || 'Документація'}</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">{t.documentation?.subtitle || 'Загальні матеріали та інструкції'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {documents.map((doc, idx) => {
              const translation = getCardTranslation(doc.key);
              return (
                <DocumentCard
                  key={idx}
                  title={translation.title}
                  description={translation.description}
                  fileType={doc.fileType}
                  filePath={doc.filePath}
                  fileSize={doc.fileSize}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
