import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import { postedAt } from '../utils/formatter';

// Mock the formatter function
vi.mock('../utils/formatter', () => ({
  postedAt: vi.fn(),
}));

const createThread = () => ({
  id: 'thread-1',
  title: 'Test Thread',
  body: 'This is a test thread body',
  category: 'test',
  createdAt: '2024-01-01T00:00:00.000Z',
  totalComments: 0,
  upVotesBy: [],
  downVotesBy: [],
  owner: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  },
});

const renderThreadItem = (thread, authUser = null, onVote = vi.fn()) => {
  return render(
    <BrowserRouter>
      <ThreadItem
        thread={thread}
        authUser={authUser}
        onVote={onVote}
      />
    </BrowserRouter>,
  );
};

describe('ThreadItem component', () => {
  beforeEach(() => {
    postedAt.mockImplementation(() => 'mocked date');
  });

  it('should render thread item correctly', () => {
    // Arrange
    const thread = createThread();

    // Act
    renderThreadItem(thread);

    // Assert
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('Test Thread')).toBeInTheDocument();
    expect(screen.getByText('This is a test thread body')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', thread.owner.avatar);
  });

  it('should handle long thread body by truncating it', () => {
    // Arrange
    const thread = {
      ...createThread(),
      body: 'A'.repeat(300), // Create a long body
    };

    // Act
    const { container } = renderThreadItem(thread);
    const threadBody = container.querySelector('.thread-body');

    // Assert
    expect(threadBody).toBeTruthy();
    expect(threadBody.innerHTML).toContain('...');
    expect(threadBody.innerHTML.length).toBeLessThan(300);
  });

  it('should handle upvote and downvote when user is authenticated', () => {
    // Arrange
    const thread = createThread();
    const authUser = { id: 'user-1' };
    const onVote = vi.fn();

    // Act
    renderThreadItem(thread, authUser, onVote);
    const [upvoteButton, downvoteButton] = screen.getAllByRole('button').slice(0, 2);

    fireEvent.click(upvoteButton);
    fireEvent.click(downvoteButton);

    // Assert
    expect(onVote).toHaveBeenCalledTimes(2);
    expect(onVote).toHaveBeenNthCalledWith(1, thread.id, 'up-vote');
    expect(onVote).toHaveBeenNthCalledWith(2, thread.id, 'down-vote');
  });

  it('should disable vote buttons when user is not authenticated', () => {
    // Arrange
    const thread = createThread();

    // Act
    renderThreadItem(thread, null);
    const [upvoteButton, downvoteButton] = screen.getAllByRole('button').slice(0, 2);

    // Assert
    expect(upvoteButton).toBeDisabled();
    expect(downvoteButton).toBeDisabled();
    expect(upvoteButton.title).toBe('Login to vote');
    expect(downvoteButton.title).toBe('Login to vote');
  });
});
