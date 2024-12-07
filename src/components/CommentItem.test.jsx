import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CommentItem from './CommentItem';
import { postedAt } from '../utils/formatter';

const mockComment = {
  owner: { avatar: 'avatar-url', name: 'John Doe' },
  createdAt: '2023-05-01T12:00:00Z',
  content: 'This is a sample comment',
  upVotesBy: ['user1', 'user2'],
  downVotesBy: ['user3'],
};

const mockAuthUser = { id: 'user1' };
const mockOnVote = vi.fn();

test('renders comment', () => {
  render(
    <CommentItem
      comment={mockComment}
      authUser={mockAuthUser}
      onVote={mockOnVote}
    />,
  );
  expect(screen.getByAltText('John Doe')).toHaveAttribute('src', 'avatar-url');
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText(postedAt('2023-05-01T12:00:00Z'))).toBeInTheDocument();
  expect(screen.getByText('This is a sample comment')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
});
