import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutPage from '../src/app/about/page';
import { LanguageProvider } from '../src/context/LanguageContext';

// Mock framer-motion to avoid React DOM unknown prop warnings
jest.mock('framer-motion', () => {
  const React = require('react');
  const DummyComponent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return {
    motion: {
      div: DummyComponent,
    },
  };
});

// Mock next/image if it's used in the future (though we use <img> currently)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}));

describe('AboutPage', () => {
  const renderWithLanguage = (ui: React.ReactElement) => {
    return render(
      <LanguageProvider>
        {ui}
      </LanguageProvider>
    );
  };

  it('renders the hero section with the correct title', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText('Cùng VIGIL chung tay bảo vệ những cánh rừng!')).toBeInTheDocument();
  });

  it('renders the brand story section', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText('Câu chuyện thương hiệu')).toBeInTheDocument();
    expect(screen.getByText('Tiếng vọng từ đại ngàn và lời hứa của những Người vệ binh số')).toBeInTheDocument();
  });

  it('renders the community activities section with field trips', () => {
    renderWithLanguage(<AboutPage />);
    expect(screen.getByText('Hoạt động cộng đồng')).toBeInTheDocument();
    expect(screen.getByText('Ninh Bình 2025')).toBeInTheDocument();
    expect(screen.getByText('Gia Lai 2026')).toBeInTheDocument();
  });
});
