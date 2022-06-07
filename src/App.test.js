import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders login button on start', () => {
    render(<App />);
    const loginBtn = screen.getByText(/login/i);
    expect(loginBtn).toBeInTheDocument();
  });
});
