"use client";

type UserSupportTextType = {
  intro?: string;
  chatsLabel?: string;
  orText?: string;
  formText?: string;
  faqIntro?: string;
  faqItems?: string[];
  instructionsText?: string;
  links?: { label: string; href: string }[];
};

interface UserSupportContentProps {
  userSupportText: UserSupportTextType;
}

export function UserSupportContent({ userSupportText }: UserSupportContentProps) {
  return (
    <div 
      style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#444' }}
      onClick={(e) => e.stopPropagation()}
    >
      <p style={{ margin: '0 0 8px 0' }}>{userSupportText.intro}</p>
      <p style={{ margin: '0 0 8px 0' }}>
        {userSupportText.chatsLabel}{' '}
        {userSupportText.links?.map((link, idx) => (
          <span key={idx}>
            {idx > 0 && ` ${userSupportText.orText} `}
            <a 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0066cc', textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>
      <p style={{ margin: '0 0 8px 0' }}>{userSupportText.formText}</p>
      <p style={{ margin: '8px 0 8px 0' }}>{userSupportText.faqIntro}</p>
      <ol style={{ margin: '0 0 8px 0', paddingLeft: 20 }}>
        {userSupportText.faqItems?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ol>
      <p style={{ margin: 0 }}>{userSupportText.instructionsText}</p>
    </div>
  );
}
