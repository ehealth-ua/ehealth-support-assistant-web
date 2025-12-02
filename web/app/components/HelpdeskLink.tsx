import Image from 'next/image';

type SizeType = 'sm' | 'md' | 'lg';

interface HelpdeskLinkProps {
  url?: string;
  children?: React.ReactNode;
  className?: string;
  size?: SizeType;
  showIcon?: boolean;
}

const sizeConfig = {
  sm: {
    padding: 'px-3 py-2',
    fontSize: 'text-sm',
    imgSize: 48
  },
  md: {
    padding: 'px-4 py-3',
    fontSize: 'text-base',
    imgSize: 64
  },
  lg: {
    padding: 'px-6 py-4',
    fontSize: 'text-lg',
    imgSize: 80
  }
};

export default function HelpdeskLink({
  url = 'https://e-health-ua.atlassian.net/servicedesk/customer/portals',
  children,
  className = '',
  size = 'md',
  showIcon = true
}: HelpdeskLinkProps) {
  const config = sizeConfig[size];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${config.padding} ${config.fontSize} rounded border border-sky-600 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:shadow transition-all ${className}`}
    >
      {showIcon && (
        <Image
          src="/images/Helpdesk team.webp"
          alt="Helpdesk team icon"
          width={config.imgSize}
          height={config.imgSize}
          className="rounded-sm"
        />
      )}
      <span>{children ?? 'Звертайтеся до нашого довідкового центру'}</span>
    </a>
  );
}
