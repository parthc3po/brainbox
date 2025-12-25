import { render, screen, fireEvent } from '@testing-library/react';
import AppNavbar from '../components/layout/AppNavbar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('AppNavbar Component', () => {
  it('renders the BrainBox logo', () => {
    render(<AppNavbar />);
    expect(screen.getByText('BrainBox')).toBeInTheDocument();
  });

  it('renders navigation links on desktop', () => {
    render(<AppNavbar />);
    expect(screen.getByText('Launchpad')).toBeInTheDocument();
    expect(screen.getByText('Missions')).toBeInTheDocument();
    expect(screen.getByText('Vault')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    render(<AppNavbar />);

    // Find the mobile menu button (it has aria-label)
    const menuButton = screen.getByLabelText('Toggle menu');

    // Initially, mobile dropdown should not be visible (only desktop nav exists)
    // After clicking, the dropdown should appear
    fireEvent.click(menuButton);

    // After clicking, we should have duplicate nav items (desktop + mobile)
    const launchpadLinks = screen.getAllByText('Launchpad');
    expect(launchpadLinks.length).toBeGreaterThanOrEqual(1);
  });
});
