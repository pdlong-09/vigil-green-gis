import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ContactPage from '../src/app/contact/page';
import { LanguageProvider } from '../src/context/LanguageContext';

// Mock framer-motion to avoid JSDOM errors
jest.mock('framer-motion', () => {
  const React = require('react');
  const Dummy = React.forwardRef(({ children, ...props }: any, ref: any) => {
    const {
      initial, animate, variants, whileInView, viewport, transition, ...validProps
    } = props;
    return <div ref={ref} {...validProps}>{children}</div>;
  });
  Dummy.displayName = 'DummyMotion';

  return {
    motion: {
      div: Dummy,
    },
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Mail: () => <svg data-testid="mail-icon" />,
  Globe: () => <svg data-testid="globe-icon" />,
  Facebook: () => <svg data-testid="facebook-icon" />,
  CheckCircle2: () => <svg data-testid="check-icon" />
}));

describe('ContactPage', () => {
  const renderWithLanguage = (ui: React.ReactElement) => {
    return render(
      <LanguageProvider>
        {ui}
      </LanguageProvider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders contact information properly', () => {
    renderWithLanguage(<ContactPage />);
    
    // Check titles
    expect(screen.getByText(/Contact VIGIL|Liên hệ với VIGIL/)).toBeInTheDocument();
    
    // Check contact info
    expect(screen.getByText('vigil.greenorg@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('www.vigil.vn')).toBeInTheDocument();
    expect(screen.getByText('https://www.facebook.com/share/18yn8UxqPE/?mibextid=wwXIfr')).toBeInTheDocument();
  });

  it('submits form and displays success message', async () => {
    renderWithLanguage(<ContactPage />);
    
    // Fill out form
    const nameInput = screen.getByLabelText(/Your Name|Tên của bạn/);
    const emailInput = screen.getByLabelText(/Email Address|Địa chỉ Email/);
    const messageInput = screen.getByLabelText(/Message \/ Feedback|Lời nhắn \/ Góp ý/);
    const submitButton = screen.getByRole('button', { name: /Send Message|Gửi đi/ });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Great project!' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Should show loading state
    expect(screen.getByRole('button', { name: /Sending...|Đang gửi.../ })).toBeInTheDocument();
    
    // Fast forward mock timers (1000ms for submission)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your feedback|Cảm ơn bạn đã góp ý/)).toBeInTheDocument();
    });
    
    // Fast forward mock timers (5000ms for reset)
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Wait for form to reset back
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Send Message|Gửi đi/ })).toBeInTheDocument();
    });
  });
});
