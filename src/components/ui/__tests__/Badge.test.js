import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  it('renders with the correct label based on variant', () => {
    render(<Badge variant="admin" />);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('renders a custom label if provided', () => {
    render(<Badge variant="admin" label="Super Admin" />);
    expect(screen.getByText('Super Admin')).toBeInTheDocument();
  });

  it('applies the correct status styles', () => {
    const { container } = render(<Badge variant="published" />);
    // "published" preset uses color #4ade80
    expect(container.firstChild).toHaveStyle({ color: '#4ade80' });
  });
});
