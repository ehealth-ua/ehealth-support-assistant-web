'use client';
import Image from 'next/image';
import { useTranslations } from '../../lib/useTranslations';

interface DocumentCardProps {
  title: string;
  description?: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  filePath?: string;
  fileSize?: string;
}

export default function DocumentCard({
  title,
  description,
  fileType,
  filePath,
  fileSize,
}: DocumentCardProps) {
  const { t } = useTranslations();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-500';
      case 'DOCX':
        return 'bg-green-500';
      case 'XLSX':
        return 'bg-blue-500';
      case 'IMG':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-500';
    }
  };

  const handleOpenDocument = () => {
    if (filePath) {
      window.open(filePath, '_blank');
    }
  };

  const isImageType = fileType === 'IMG';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow">
      {/* Document Type Badge */}
      <div className={`${getTypeColor(fileType)} text-white px-4 py-2 font-bold text-sm`}>
        {fileType}
      </div>

      {/* Preview Area */}
      <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {filePath && isImageType ? (
          <div className="relative w-full h-full">
            <Image
              src={filePath}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-2">
              {fileType === 'PDF' && '📄'}
              {fileType === 'DOCX' && '📝'}
              {fileType === 'XLSX' && '📊'}
              {fileType === 'IMG' && '🖼️'}
            </div>
            <p className="text-sm">{fileType}</p>
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="p-4">
        <button
          onClick={handleOpenDocument}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg mb-2 text-left hover:underline cursor-pointer"
        >
          {title}
        </button>
        {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
        {fileSize && <p className="text-gray-500 text-xs">{t.documentation?.fileSize || 'Розмір'}: {fileSize}</p>}
      </div>

      {/* Edit Icon */}
      <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
    </div>
  );
}
