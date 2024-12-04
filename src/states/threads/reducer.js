// states/threads/reducer.js
import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;

    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];

    case ActionType.RECEIVE_THREAD_DETAIL: {
      const threadIndex = threads.findIndex((thread) => thread.id === action.payload.threadDetail.id);
      if (threadIndex >= 0) {
        return [...threads.slice(0, threadIndex), action.payload.threadDetail, ...threads.slice(threadIndex + 1)];
      }
      return [...threads, action.payload.threadDetail];
    }

    case ActionType.ADD_COMMENT:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            comments: [action.payload.comment, ...(thread.comments || [])],
          };
        }
        return thread;
      });

    case ActionType.TOGGLE_UPVOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            upVotesBy: thread.upVotesBy.includes(action.payload.userId) ? thread.upVotesBy.filter((id) => id !== action.payload.userId) : [...thread.upVotesBy, action.payload.userId],
            downVotesBy: thread.downVotesBy.filter((id) => id !== action.payload.userId),
          };
        }
        return thread;
      });

    case ActionType.TOGGLE_DOWNVOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            downVotesBy: thread.downVotesBy.includes(action.payload.userId) ? thread.downVotesBy.filter((id) => id !== action.payload.userId) : [...thread.downVotesBy, action.payload.userId],
            upVotesBy: thread.upVotesBy.filter((id) => id !== action.payload.userId),
          };
        }
        return thread;
      });

    case ActionType.TOGGLE_UPVOTE_COMMENT:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            comments: thread.comments.map((comment) => {
              if (comment.id === action.payload.commentId) {
                return {
                  ...comment,
                  upVotesBy: comment.upVotesBy.includes(action.payload.userId) ? comment.upVotesBy.filter((id) => id !== action.payload.userId) : [...comment.upVotesBy, action.payload.userId],
                  downVotesBy: comment.downVotesBy.filter((id) => id !== action.payload.userId),
                };
              }
              return comment;
            }),
          };
        }
        return thread;
      });

    case ActionType.TOGGLE_DOWNVOTE_COMMENT:
      return threads.map((thread) => {
        if (thread.id === action.payload.threadId) {
          return {
            ...thread,
            comments: thread.comments.map((comment) => {
              if (comment.id === action.payload.commentId) {
                return {
                  ...comment,
                  downVotesBy: comment.downVotesBy.includes(action.payload.userId) ? comment.downVotesBy.filter((id) => id !== action.payload.userId) : [...comment.downVotesBy, action.payload.userId],
                  upVotesBy: comment.upVotesBy.filter((id) => id !== action.payload.userId),
                };
              }
              return comment;
            }),
          };
        }
        return thread;
      });

    default:
      return threads;
  }
}

export default threadsReducer;
