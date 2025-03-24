import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Header from './Header.svelte';

describe('Header', () => {
  it('renders header component', () => {
    render(Header);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
}); 