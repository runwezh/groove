import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Mute from './Mute.svelte';

describe('Mute', () => {
  it('renders mute button', () => {
    render(Mute);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles mute state on click', async () => {
    render(Mute);
    const button = screen.getByRole('button');
    
    // 初始状态
    expect(button.getAttribute('aria-label')).toBe('静音');
    
    // 点击按钮
    await fireEvent.click(button);
    
    // 切换后的状态
    expect(button.getAttribute('aria-label')).toBe('取消静音');
  });
}); 