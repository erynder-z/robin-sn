import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginScreen from './LoginScreen';

describe('LoginScreen component', () => {
  it('displays eror message when tryling to login with non-valid credentials', async () => {
    render(<LoginScreen />);

    const button = screen.getByRole('button', { name: 'Login' });

    userEvent.click(button);

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});
