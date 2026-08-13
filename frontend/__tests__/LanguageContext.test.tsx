import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

const TestComponent = () => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="text">{t('nav.home')}</span>
      <button onClick={toggleLanguage} data-testid="toggle-btn">Toggle</button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('provides default language as vi', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('vi');
    expect(screen.getByTestId('text').textContent).toBe('Trang chủ');
  });

  it('toggles language to en', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const btn = screen.getByTestId('toggle-btn');
    fireEvent.click(btn);
    
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('text').textContent).toBe('Home');
  });
});
