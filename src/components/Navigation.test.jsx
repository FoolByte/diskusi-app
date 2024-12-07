import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { asyncUnsetAuthUser } from '../states/auth/action';
import Navigation from './Navigation';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(() => vi.fn()),
}));

vi.mock('../states/auth/action', () => ({
  asyncUnsetAuthUser: vi.fn(),
}));

const renderNavigation = (authUser = null) => {
  vi.mocked(useSelector).mockReturnValue(authUser);
  return render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>,
  );
};

describe('Navigation', () => {
  it('should render navigation with authentication status', () => {
    const authUser = { id: 'user-1', name: 'John Doe' };
    renderNavigation(authUser);

    expect(screen.getByText('Forum Diskusi')).toBeInTheDocument();
    expect(screen.getByText('Threads')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('should render navigation without authentication', () => {
    renderNavigation(null);

    expect(screen.getByText('Forum Diskusi')).toBeInTheDocument();
    expect(screen.getByText('Threads')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should call asyncUnsetAuthUser on logout', () => {
    const authUser = { id: 'user-1', name: 'John Doe' };
    renderNavigation(authUser);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(vi.mocked(asyncUnsetAuthUser)).toHaveBeenCalledTimes(1);
  });
});
