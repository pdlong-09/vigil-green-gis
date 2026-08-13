import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock framer-motion to avoid animation issues in Jest
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, whileInView, variants, initial, animate, viewport, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
      h1: React.forwardRef(({ children, whileInView, variants, initial, animate, viewport, ...props }: any, ref: any) => <h1 ref={ref} {...props}>{children}</h1>),
      p: React.forwardRef(({ children, whileInView, variants, initial, animate, viewport, ...props }: any, ref: any) => <p ref={ref} {...props}>{children}</p>),
    },
  };
});

describe('LandingPage', () => {
  it('renders landing page sections', () => {
    render(
      <LanguageProvider>
        <LandingPage />
      </LanguageProvider>
    );
    
    // Check Hero buttons
    expect(screen.getByText('Khám phá bản đồ VIGIL')).toBeInTheDocument();
    expect(screen.getByText('Tìm hiểu dự án')).toBeInTheDocument();
  });
});
