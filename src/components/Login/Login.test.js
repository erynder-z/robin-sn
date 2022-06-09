import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('LoginScreen component', () => {
  it('displays eror message when tryling to login with non-valid credentials', async () => {
    render(<Login />);

    const button = screen.getByRole('button', { name: 'Login' });

    userEvent.click(button);

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});
