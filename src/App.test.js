import { render, screen } from '@testing-library/react';
import App from './App';

test('renders invoices heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /invoices/i })).toBeInTheDocument();
});
