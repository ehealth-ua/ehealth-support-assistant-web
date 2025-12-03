"use client"
import DocumentCard from '../../components/DocumentCard';
import { useTranslations } from '../../../lib/useTranslations';

interface Document {
  title: string;
  description?: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  filePath?: string;
  fileSize?: string;
}

export default function GuidelinesPage() {
  const { t } = useTranslations();

  // Резервні картки для майбутньої документації
  const documents: Document[] = [
    // Рядок 1
    {
      title: `${t.guidelines?.document || 'Документ'} №1 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.pdfDescription || 'Місце для майбутнього файлу PDF',
      fileType: 'PDF',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №2 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.docxDescription || 'Місце для майбутнього файлу DOCX',
      fileType: 'DOCX',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №3 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.imgDescription || 'Місце для майбутнього зображення',
      fileType: 'IMG',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №4 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.xlsxDescription || 'Місце для майбутнього файлу XLSX',
      fileType: 'XLSX',
    },
    // Рядок 2
    {
      title: `${t.guidelines?.document || 'Документ'} №5 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.pdfDescription || 'Місце для майбутнього файлу PDF',
      fileType: 'PDF',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №6 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.docxDescription || 'Місце для майбутнього файлу DOCX',
      fileType: 'DOCX',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №7 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.imgDescription || 'Місце для майбутнього зображення',
      fileType: 'IMG',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №8 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.xlsxDescription || 'Місце для майбутнього файлу XLSX',
      fileType: 'XLSX',
    },
    // Рядок 3
    {
      title: `${t.guidelines?.document || 'Документ'} №9 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.pdfDescription || 'Місце для майбутнього файлу PDF',
      fileType: 'PDF',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №10 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.docxDescription || 'Місце для майбутнього файлу DOCX',
      fileType: 'DOCX',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №11 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.imgDescription || 'Місце для майбутнього зображення',
      fileType: 'IMG',
    },
    {
      title: `${t.guidelines?.document || 'Документ'} №12 (${t.guidelines?.reserve || 'Резерв'})`,
      description: t.guidelines?.xlsxDescription || 'Місце для майбутнього файлу XLSX',
      fileType: 'XLSX',
    },
  ];

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
          <h1 className="text-5xl font-bold text-white text-center">{t.guidelines?.title || 'Загальні настанови'}</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">{t.guidelines?.subtitle || 'Загальні настанови для користувачів порталу'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {documents.map((doc, idx) => (
              <DocumentCard
                key={idx}
                title={doc.title}
                description={doc.description}
                fileType={doc.fileType}
                filePath={doc.filePath}
                fileSize={doc.fileSize}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
