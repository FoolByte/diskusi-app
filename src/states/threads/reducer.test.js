import { describe, it, expect } from 'vitest';
import threadsReducer from './reducer';
import { ActionType } from './action';

describe('threadsReducer function', () => {
  // Test for RECEIVE_THREADS
  describe('RECEIVE_THREADS action', () => {
    it('should return the threads payload when given RECEIVE_THREADS action', () => {
      // Arrange
      const initialState = [];
      const threads = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
          body: 'Thread body 1',
          upVotesBy: [],
          downVotesBy: [],
        },
        {
          id: 'thread-2',
          title: 'Thread Test 2',
          body: 'Thread body 2',
          upVotesBy: [],
          downVotesBy: [],
        },
      ];
      const action = {
        type: ActionType.RECEIVE_THREADS,
        payload: {
          threads,
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState).toEqual(threads);
    });
  });

  // Test for ADD_THREAD
  describe('ADD_THREAD action', () => {
    it('should add new thread to the beginning of threads list', () => {
      // Arrange
      const initialState = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
          body: 'Thread body 1',
        },
      ];

      const newThread = {
        id: 'thread-2',
        title: 'Thread Test 2',
        body: 'Thread body 2',
      };

      const action = {
        type: ActionType.ADD_THREAD,
        payload: {
          thread: newThread,
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState).toHaveLength(2);
      expect(nextState[0]).toEqual(newThread);
    });
  });

  // Test for TOGGLE_UPVOTE_THREAD
  describe('TOGGLE_UPVOTE_THREAD action', () => {
    it('should add userId to upVotesBy when user has not voted', () => {
      // Arrange
      const initialState = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ];

      const action = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: {
          threadId: 'thread-1',
          userId: 'user-1',
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState[0].upVotesBy).toContain('user-1');
      expect(nextState[0].downVotesBy).not.toContain('user-1');
    });

    it('should remove userId from upVotesBy when user has already upvoted', () => {
      // Arrange
      const initialState = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ];

      const action = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: {
          threadId: 'thread-1',
          userId: 'user-1',
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState[0].upVotesBy).not.toContain('user-1');
    });

    it('should remove userId from downVotesBy when user upvotes', () => {
      // Arrange
      const initialState = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
          upVotesBy: [],
          downVotesBy: ['user-1'],
        },
      ];

      const action = {
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: {
          threadId: 'thread-1',
          userId: 'user-1',
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState[0].upVotesBy).toContain('user-1');
      expect(nextState[0].downVotesBy).not.toContain('user-1');
    });
  });

  // Test for ADD_COMMENT
  describe('ADD_COMMENT action', () => {
    it('should add new comment to the beginning of thread comments', () => {
      // Arrange
      const initialState = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
          comments: [
            {
              id: 'comment-1',
              content: 'First comment',
            },
          ],
        },
      ];

      const newComment = {
        id: 'comment-2',
        content: 'Second comment',
      };

      const action = {
        type: ActionType.ADD_COMMENT,
        payload: {
          threadId: 'thread-1',
          comment: newComment,
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState[0].comments).toHaveLength(2);
      expect(nextState[0].comments[0]).toEqual(newComment);
    });

    it('should initialize comments array if it does not exist', () => {
      // Arrange
      const initialState = [
        {
          id: 'thread-1',
          title: 'Thread Test 1',
        },
      ];

      const newComment = {
        id: 'comment-1',
        content: 'First comment',
      };

      const action = {
        type: ActionType.ADD_COMMENT,
        payload: {
          threadId: 'thread-1',
          comment: newComment,
        },
      };

      // Action
      const nextState = threadsReducer(initialState, action);

      // Assert
      expect(nextState[0].comments).toBeDefined();
      expect(nextState[0].comments).toHaveLength(1);
      expect(nextState[0].comments[0]).toEqual(newComment);
    });
  });
});
