import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/layout/Header';
import { LanguageProvider } from '@/context/LanguageContext';

describe('Header', () => {
  it('renders navigation links', () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    
    expect(screen.getByAltText('VIGIL Logo')).toBeInTheDocument();
    expect(screen.getByText('Trang chủ')).toBeInTheDocument();
    expect(screen.getByText('Bản đồ VIGIL')).toBeInTheDocument();
    expect(screen.getByText('Về VIGIL')).toBeInTheDocument();
  });
});
