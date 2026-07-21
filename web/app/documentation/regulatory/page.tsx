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

export default function RegulatoryPage() {
  const { t } = useTranslations();

  // Резервні картки для майбутніх нормативних документів
  const documents: Document[] = [
    // Рядок 1
    {
      title: `${t.regulatory?.document || 'Документ'} №1 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.pdfDescription || 'Місце для майбутнього файлу PDF',
      fileType: 'PDF',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №2 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.docxDescription || 'Місце для майбутнього файлу DOCX',
      fileType: 'DOCX',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №3 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.imgDescription || 'Місце для майбутнього зображення',
      fileType: 'IMG',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №4 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.xlsxDescription || 'Місце для майбутнього файлу XLSX',
      fileType: 'XLSX',
    },
    // Рядок 2
    {
      title: `${t.regulatory?.document || 'Документ'} №5 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.pdfDescription || 'Місце для майбутнього файлу PDF',
      fileType: 'PDF',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №6 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.docxDescription || 'Місце для майбутнього файлу DOCX',
      fileType: 'DOCX',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №7 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.imgDescription || 'Місце для майбутнього зображення',
      fileType: 'IMG',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №8 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.xlsxDescription || 'Місце для майбутнього файлу XLSX',
      fileType: 'XLSX',
    },
    // Рядок 3
    {
      title: `${t.regulatory?.document || 'Документ'} №9 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.pdfDescription || 'Місце для майбутнього файлу PDF',
      fileType: 'PDF',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №10 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.docxDescription || 'Місце для майбутнього файлу DOCX',
      fileType: 'DOCX',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №11 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.imgDescription || 'Місце для майбутнього зображення',
      fileType: 'IMG',
    },
    {
      title: `${t.regulatory?.document || 'Документ'} №12 (${t.regulatory?.reserve || 'Резерв'})`,
      description: t.regulatory?.xlsxDescription || 'Місце для майбутнього файлу XLSX',
      fileType: 'XLSX',
    },
  ];

  return (
    <>
      <div
        className="w-full h-32 bg-cover bg-top relative"
        style={{
          backgroundImage: "url('/ehealth-support-assistant-web/images/Hero_ezdorovya.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">{t.regulatory?.title || 'Нормативні документи'}</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">{t.regulatory?.subtitle || "Нормативні документи порталу е-Здоров'я"}</h2>
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
