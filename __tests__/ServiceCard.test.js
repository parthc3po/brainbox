import { render, screen } from '@testing-library/react';
import ServiceCard from '../components/features/ServiceCard';

describe('ServiceCard Component', () => {
  it('renders title and description', () => {
    render(
      <ServiceCard
        title="Test Tool"
        url="http://test.com"
        description="A testing tool"
      />
    );

    expect(screen.getByText('Test Tool')).toBeInTheDocument();
    expect(screen.getByText('A testing tool')).toBeInTheDocument();
  });

  it('links to the correct url', () => {
    render(
      <ServiceCard
        title="Link Test"
        url="http://example.com"
        description="Desc"
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://example.com');
  });
});
