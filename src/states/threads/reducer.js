import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
  case ActionType.RECEIVE_THREADS:
    return action.payload.threads;
  case ActionType.ADD_THREAD:
    return [
      {
        ...action.payload.thread,
        upVotesBy: action.payload.thread.upVotesBy || [],
        downVotesBy: action.payload.thread.downVotesBy || [],
        totalComments: action.payload.thread.totalComments || 0,
      },
      ...threads,
    ];
  case ActionType.TOGGLE_LIKE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: thread.upVotesBy.includes(action.payload.userId) ? thread.upVotesBy.filter((id) => id !== action.payload.userId) : [...thread.upVotesBy, action.payload.userId],
        };
      }
      return thread;
    });
  default:
    return threads;
  }
}

export default threadsReducer;
