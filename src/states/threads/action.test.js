import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncReceiveThreads, asyncAddThread, asyncToggleVoteThread, receiveThreadsActionCreator, addThreadActionCreator, toggleUpvoteThreadActionCreator, toggleDownvoteThreadActionCreator } from './action';

// Mock the fetch function
global.fetch = vi.fn();
global.alert = vi.fn();

// Mock the fetchWithAuth utility
vi.mock('../../utils/api', () => ({
  fetchWithAuth: vi.fn(),
}));

// Import the mocked fetchWithAuth
import { fetchWithAuth } from '../../utils/api';

describe('asyncReceiveThreads thunk', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should dispatch receiveThreads action with threads data when fetch success', async () => {
    // Arrange
    const threads = [
      { id: 'thread-1', title: 'Thread 1' },
      { id: 'thread-2', title: 'Thread 2' },
    ];
    const fakeResponse = { data: { threads } };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(fakeResponse),
    });

    // Create mock dispatch function
    const dispatch = vi.fn();

    // Act
    await asyncReceiveThreads()(dispatch);

    // Assert
    expect(fetch).toHaveBeenCalledWith('https://forum-api.dicoding.dev/v1/threads');
    expect(dispatch).toHaveBeenCalledWith(receiveThreadsActionCreator(threads));
  });

  it('should show alert when fetch failed', async () => {
    // Arrange
    const errorMessage = 'Network Error';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    // Create mock dispatch function
    const dispatch = vi.fn();

    // Act
    await asyncReceiveThreads()(dispatch);

    // Assert
    expect(fetch).toHaveBeenCalledWith('https://forum-api.dicoding.dev/v1/threads');
    expect(alert).toHaveBeenCalledWith(errorMessage);
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('asyncAddThread thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch addThread action and return thread when API call success', async () => {
    // Arrange
    const threadData = {
      title: 'New Thread',
      body: 'Thread content',
      category: 'general',
    };

    const fakeResponse = {
      data: {
        thread: { ...threadData, id: 'thread-123' },
      },
    };

    fetchWithAuth.mockResolvedValueOnce({
      json: () => Promise.resolve(fakeResponse),
    });

    const dispatch = vi.fn();

    // Act
    const result = await asyncAddThread(threadData)(dispatch);

    // Assert
    expect(fetchWithAuth).toHaveBeenCalledWith('https://forum-api.dicoding.dev/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(threadData),
    });
    expect(dispatch).toHaveBeenCalledWith(addThreadActionCreator(fakeResponse.data.thread));
    expect(result).toEqual(fakeResponse.data.thread);
  });

  it('should show alert and return null when API call failed', async () => {
    // Arrange
    const threadData = {
      title: 'New Thread',
      body: 'Thread content',
      category: 'general',
    };

    const errorMessage = 'Network Error';
    fetchWithAuth.mockRejectedValueOnce(new Error(errorMessage));

    const dispatch = vi.fn();

    // Act
    const result = await asyncAddThread(threadData)(dispatch);

    // Assert
    expect(alert).toHaveBeenCalledWith(errorMessage);
    expect(dispatch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});

describe('asyncToggleVoteThread thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch toggle upvote action when upvoting thread succeeds', async () => {
    // Arrange
    const threadId = 'thread-123';
    const userId = 'user-123';
    const voteType = 'up-vote';

    const fakeResponse = {
      status: 'success',
    };

    fetchWithAuth.mockResolvedValueOnce({
      json: () => Promise.resolve(fakeResponse),
    });

    const dispatch = vi.fn();
    const getState = vi.fn(() => ({
      auth: { id: userId },
    }));

    // Act
    await asyncToggleVoteThread({ threadId, voteType })(dispatch, getState);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(toggleUpvoteThreadActionCreator({ threadId, userId }));
    expect(fetchWithAuth).toHaveBeenCalledWith(`https://forum-api.dicoding.dev/v1/threads/${threadId}/${voteType}`, { method: 'POST' });
  });

  it('should rollback vote action when API call fails', async () => {
    // Arrange
    const threadId = 'thread-123';
    const userId = 'user-123';
    const voteType = 'down-vote';

    fetchWithAuth.mockRejectedValueOnce(new Error('Network Error'));

    const dispatch = vi.fn();
    const getState = vi.fn(() => ({
      auth: { id: userId },
    }));

    // Act
    await asyncToggleVoteThread({ threadId, voteType })(dispatch, getState);

    // Assert
    // Should be called twice: once for optimistic update and once for rollback
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, toggleDownvoteThreadActionCreator({ threadId, userId }));
    expect(dispatch).toHaveBeenNthCalledWith(2, toggleDownvoteThreadActionCreator({ threadId, userId }));
    expect(alert).toHaveBeenCalled();
  });
});
