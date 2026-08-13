import React from 'react';
import { render, screen } from '@testing-library/react';
import PublicationPage from '../src/app/publication/page';
import { LanguageProvider } from '../src/context/LanguageContext';

// Mock Framer Motion to render child content without animation in JSDOM
jest.mock('framer-motion', () => {
  const React = require('react');
  const Dummy = React.forwardRef(({ children, ...props }: any, ref: any) => {
    // filter out framer-motion specific props to avoid React warnings on DOM elements
    const {
      initial, animate, variants, whileInView, viewport, transition, ...validProps
    } = props;
    return <div ref={ref} {...validProps}>{children}</div>;
  });
  Dummy.displayName = 'DummyMotion';

  return {
    motion: {
      div: Dummy,
      section: Dummy,
    },
  };
});

describe('PublicationPage', () => {
  const renderWithLanguage = (ui: React.ReactElement) => {
    return render(
      <LanguageProvider>
        {ui}
      </LanguageProvider>
    );
  };

  it('renders the hero section correctly', () => {
    renderWithLanguage(<PublicationPage />);
    
    // Check if the hero title exists
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders all 5 research sections', () => {
    renderWithLanguage(<PublicationPage />);
    
    // Tab: Tóm tắt (tiếng Việt — default language)
    expect(screen.getAllByText(/Tóm tắt/).length).toBeGreaterThan(0);
    
    // Tab: Phương pháp
    expect(screen.getAllByText(/Phương pháp/).length).toBeGreaterThan(0);
    
    // Tab: Tập dữ liệu
    expect(screen.getAllByText(/Tập dữ liệu/).length).toBeGreaterThan(0);
    
    // Tab: Kết quả
    expect(screen.getAllByText(/Kết quả/).length).toBeGreaterThan(0);
    
    // Section: Lộ trình nghiên cứu
    expect(screen.getAllByText(/Lộ trình nghiên cứu/).length).toBeGreaterThan(0);
  });
});
