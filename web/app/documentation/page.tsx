import DocumentCard from '../components/DocumentCard';

export const metadata = {
  title: 'Документація',
  description: 'Документація е-Здоров\'я',
};

interface Document {
  title: string;
  description?: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  filePath?: string;
  fileSize?: string;
}

// Mock data - у майбутньому буде завантажуватися з БД або API
const documents: Document[] = [
  {
    title: 'Варіанти техніки побудови промптів',
    description: 'Тип: PDF. Розмір: [Вкажіть розмір]',
    fileType: 'PDF',
    filePath: '/docs/prompt-techniques.pdf',
    fileSize: '2.5 MB',
  },
  {
    title: 'Промптинг (Огляд)',
    description: 'Тип: PDF. Розмір: [Вкажіть розмір]',
    fileType: 'PDF',
    filePath: '/docs/prompting.pdf',
    fileSize: '1.8 MB',
  },
  {
    title: 'Чек-лист для новостворених команд ЕК',
    description: 'Тип: DOCX. Розмір: [Вкажіть розмір]',
    fileType: 'DOCX',
    filePath: '/docs/ek-teams-checklist.docx',
    fileSize: '0.5 MB',
  },
  {
    title: 'ДЗР довідник',
    description: 'Тип: XLSX. Розмір: [Вкажіть розмір]',
    fileType: 'XLSX',
    filePath: '/docs/dzr-reference.xlsx',
    fileSize: '1.2 MB',
  },
  {
    title: 'EKOPFO database model',
    description: 'Тип: Зображення (Схема) Розмір: [Вкажіть розмір]',
    fileType: 'IMG',
    filePath: '/images/EKOPFO database model.png',
    fileSize: '0.8 MB',
  },
  {
    title: 'Статус модель справи ЕКОПФО',
    description: 'Тип: Зображення (Схема)',
    fileType: 'IMG',
    filePath: '/images/Статус модель справи ЕКОПФО.png',
    fileSize: '0.6 MB',
  },
  {
    title: 'Статус-модель вектор',
    description: 'Тип: Зображення (SVG-Вектор) Розмір: [Вкажіть розмір]',
    fileType: 'IMG',
    filePath: '/images/Статус-модель вектор.svg',
    fileSize: '0.3 MB',
  },
  {
    title: 'Статус-модель картинка',
    description: 'Тип: Зображення (JPG-Картинка) Розмір: [Вкажіть розмір]',
    fileType: 'IMG',
    filePath: '/images/Статус-модель картинка.jpg',
    fileSize: '0.7 MB',
  },
  {
    title: 'Документ №9 (Резерв)',
    description: 'Місце для майбутнього файлу PDF',
    fileType: 'PDF',
  },
  {
    title: 'Документ №10 (Резерв)',
    description: 'Місце для майбутнього файлу DOCX',
    fileType: 'DOCX',
  },
  {
    title: 'Документ №11 (Резерв)',
    description: 'Місце для майбутнього зображення',
    fileType: 'IMG',
  },
  {
    title: 'Документ №12 (Резерв)',
    description: 'Місце для майбутнього файлу XLSX',
    fileType: 'XLSX',
  },
];

export default function DocumentationPage() {
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
          <h1 className="text-5xl font-bold text-white text-center">Документація</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">Загальні матеріали та інструкції</h2>
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
  );
}
