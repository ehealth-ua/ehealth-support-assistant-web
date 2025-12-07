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

  const docs = t.documentation?.generalGuidelines?.documents;
  
  const documents: Document[] = [
    {
      title: docs?.doc1?.title || 'Інструкція АДМІНІСТРАТОРА ЗОЗ (ЕК)',
      description: docs?.doc1?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція АДМІНІСТРАТОРА ЗОЗ (ЕК).pdf',
    },
    {
      title: docs?.doc2?.title || 'Інструкція АДМІНІСТРАТОРА СИСТЕМИ',
      description: docs?.doc2?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція АДМІНІСТРАТОРА СИСТЕМИ.pdf',
    },
    {
      title: docs?.doc3?.title || 'Інструкція АДМІНІСТРАТОРА ЦЕНТРУ ОЦІНЮВАННЯ',
      description: docs?.doc3?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція АДМІНІСТРАТОРА ЦЕНТРУ ОЦІНЮВАННЯ.pdf',
    },
    {
      title: docs?.doc4?.title || 'Інструкція ГОЛОВИ ВЛК',
      description: docs?.doc4?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ГОЛОВИ ВЛК.pdf',
    },
    {
      title: docs?.doc5?.title || 'Інструкція ГОЛОВУЮЧОГО ЕКСПЕРТНОЇ КОМАНДИ ЦО',
      description: docs?.doc5?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ГОЛОВУЮЧОГО ЕКСПЕРТНОЇ КОМАНДИ ЦО.pdf',
    },
    {
      title: docs?.doc6?.title || 'Інструкція ГОЛОВУЮЧОГО ЕКСПЕРТНОЇ КОМАНДИ',
      description: docs?.doc6?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ГОЛОВУЮЧОГО ЕКСПЕРТНОЇ КОМАНДИ.pdf',
    },
    {
      title: docs?.doc7?.title || 'Інструкція ЗАСТУПНИКА КЕРІВНИКА ЗОЗ (ЕК)',
      description: docs?.doc7?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЗАСТУПНИКА КЕРІВНИКА ЗОЗ (ЕК).pdf',
    },
    {
      title: docs?.doc8?.title || 'Інструкція ЗАСТУПНИКА КЕРІВНИКА ЗОЗ',
      description: docs?.doc8?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЗАСТУПНИКА КЕРІВНИКА ЗОЗ.pdf',
    },
    {
      title: docs?.doc9?.title || 'Інструкція ЗАСТУПНИКА КЕРІВНИКА ЦЕНТРУ ОЦІНЮВАННЯ',
      description: docs?.doc9?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЗАСТУПНИКА КЕРІВНИКА ЦЕНТРУ ОЦІНЮВАННЯ.pdf',
    },
    {
      title: docs?.doc10?.title || 'Інструкція КЕРІВНИКА ЗОЗ (ЕК)',
      description: docs?.doc10?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція КЕРІВНИКА ЗОЗ (ЕК).pdf',
    },
    {
      title: docs?.doc11?.title || 'Інструкція КЕРІВНИКА ЗОЗ',
      description: docs?.doc11?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція КЕРІВНИКА ЗОЗ.pdf',
    },
    {
      title: docs?.doc12?.title || 'Інструкція КЕРІВНИКА ЦЕНТРУ ОЦІНЮВАННЯ',
      description: docs?.doc12?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція КЕРІВНИКА ЦЕНТРУ ОЦІНЮВАННЯ.pdf',
    },
    {
      title: docs?.doc13?.title || 'Інструкція ЛІКУЮЧОГО ЛІКАРЯ',
      description: docs?.doc13?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЛІКУЮЧОГО ЛІКАРЯ.pdf',
    },
    {
      title: docs?.doc14?.title || 'Інструкція РЕЄСТРАТОРА ЗОЗ (ПОМІЧНИК ЛЛ)',
      description: docs?.doc14?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція РЕЄСТРАТОРА ЗОЗ (ПОМІЧНИК ЛЛ).pdf',
    },
    {
      title: docs?.doc15?.title || 'Інструкція УПОВНОВАЖЕНИХ ПРАЦІВНИКІВ НАЦІОНАЛЬНОЇ ПОЛІЦІЇ-ДБР-СБУ-НАБУ',
      description: docs?.doc15?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція УПОВНОВАЖЕНИХ ПРАЦІВНИКІВ НАЦІОНАЛЬНОЇ ПОЛІЦІЇ-ДБР-СБУ-НАБУ.pdf',
    },
    {
      title: docs?.doc16?.title || 'Інструкція УПОВНОВАЖЕНОЇ ОСОБИ МОЗ',
      description: docs?.doc16?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція УПОВНОВАЖЕНОЇ ОСОБИ МОЗ.pdf',
    },
    {
      title: docs?.doc17?.title || 'Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ ЦО',
      description: docs?.doc17?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ ЦО.pdf',
    },
    {
      title: docs?.doc18?.title || 'Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ-ВІДПОВІДАЛЬНОГО ЗА ВЕДЕННЯ СПРАВ ЦО',
      description: docs?.doc18?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ-ВІДПОВІДАЛЬНОГО ЗА ВЕДЕННЯ СПРАВ ЦО.pdf',
    },
    {
      title: docs?.doc19?.title || 'Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ-ВІДПОВІДАЛЬНОГО ЗА ВЕДЕННЯ СПРАВ',
      description: docs?.doc19?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ-ВІДПОВІДАЛЬНОГО ЗА ВЕДЕННЯ СПРАВ.pdf',
    },
    {
      title: docs?.doc20?.title || 'Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ',
      description: docs?.doc20?.description || 'Тип: PDF',
      fileType: 'PDF',
      filePath: '/documents/Інструкція ЧЛЕНА ЕКСПЕРТНОЇ КОМАНДИ.pdf',
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
