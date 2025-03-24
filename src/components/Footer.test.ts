import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Footer from './Footer.svelte';

describe('Footer', () => {
  it('renders footer component', () => {
    render(Footer);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('contains copyright information', () => {
    render(Footer);
    expect(screen.getByText(/©/i)).toBeInTheDocument();
  });
}); 