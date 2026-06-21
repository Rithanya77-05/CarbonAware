import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { UserDataProvider } from '../context/UserDataContext';
import EcoBot from '../components/EcoBot';

// Wrap with required providers
const renderEcoBot = () =>
  render(
    <MemoryRouter>
      <UserDataProvider>
        <EcoBot />
      </UserDataProvider>
    </MemoryRouter>
  );

describe('EcoBot', () => {
  it('renders the floating chat button', () => {
    renderEcoBot();
    const btn = screen.getByRole('button', { name: /open ecobot/i });
    expect(btn).toBeTruthy();
  });

  it('chat panel is hidden by default', () => {
    renderEcoBot();
    expect(screen.queryByText(/CarbonAware EcoBot/i)).toBeNull();
  });

  it('opens chat panel when floating button is clicked', async () => {
    const user = userEvent.setup();
    renderEcoBot();
    const btn = screen.getByRole('button', { name: /open ecobot/i });
    await user.click(btn);
    expect(screen.getByText(/CarbonAware EcoBot/i)).toBeTruthy();
  });

  it('displays welcome message on first open', async () => {
    const user = userEvent.setup();
    renderEcoBot();
    await user.click(screen.getByRole('button', { name: /open ecobot/i }));
    expect(screen.getByText(/Welcome to CarbonAware EcoBot/i)).toBeTruthy();
  });

  it('closes chat panel when button is clicked again', async () => {
    const user = userEvent.setup();
    renderEcoBot();
    const btn = screen.getByRole('button', { name: /open ecobot/i });
    await user.click(btn); // open
    await waitFor(() => expect(screen.getByText(/CarbonAware EcoBot/i)).toBeInTheDocument());
    await user.click(btn); // close
    await waitFor(() => expect(screen.queryByText(/CarbonAware EcoBot/i)).toBeNull());
  });

  it('renders suggestion chips when chat is open', async () => {
    const user = userEvent.setup();
    renderEcoBot();
    await user.click(screen.getByRole('button', { name: /open ecobot/i }));
    expect(screen.getByText(/How can I reduce my carbon footprint\?/i)).toBeTruthy();
  });

  it('send button is present in open chat', async () => {
    const user = userEvent.setup();
    renderEcoBot();
    await user.click(screen.getByRole('button', { name: /open ecobot/i }));
    // Input field should be visible
    expect(screen.getByPlaceholderText(/Ask EcoBot anything/i)).toBeTruthy();
  });
});
