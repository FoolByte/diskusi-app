import { fetchWithAuth } from '../../utils/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  TOGGLE_UPVOTE_THREAD: 'TOGGLE_UPVOTE_THREAD',
  TOGGLE_DOWNVOTE_THREAD: 'TOGGLE_DOWNVOTE_THREAD',
  ADD_COMMENT: 'ADD_COMMENT',
  TOGGLE_UPVOTE_COMMENT: 'TOGGLE_UPVOTE_COMMENT',
  TOGGLE_DOWNVOTE_COMMENT: 'TOGGLE_DOWNVOTE_COMMENT',
};

function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThreadActionCreator(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

function receiveThreadDetailActionCreator(threadDetail) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      threadDetail,
    },
  };
}

function toggleUpvoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_UPVOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function toggleDownvoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function addCommentActionCreator({ threadId, comment }) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      threadId,
      comment,
    },
  };
}

function toggleUpvoteCommentActionCreator({ threadId, commentId, userId }) {
  return {
    type: ActionType.TOGGLE_UPVOTE_COMMENT,
    payload: {
      threadId,
      commentId,
      userId,
    },
  };
}

function toggleDownvoteCommentActionCreator({ threadId, commentId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
    payload: {
      threadId,
      commentId,
      userId,
    },
  };
}

// Async action creators
function asyncReceiveThreads() {
  return async (dispatch) => {
    try {
      const response = await fetch('https://forum-api.dicoding.dev/v1/threads');
      const json = await response.json();
      dispatch(receiveThreadsActionCreator(json.data.threads));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncAddThread({ title, body, category = 'general' }) {
  return async (dispatch) => {
    try {
      const response = await fetchWithAuth('https://forum-api.dicoding.dev/v1/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          category,
        }),
      });
      const responseJson = await response.json();
      const thread = responseJson.data.thread;
      dispatch(addThreadActionCreator(thread));
      return thread;
    } catch (error) {
      alert(error.message);
      return null;
    }
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    try {
      const response = await fetch(`https://forum-api.dicoding.dev/v1/threads/${threadId}`);
      const json = await response.json();
      dispatch(receiveThreadDetailActionCreator(json.data.detailThread));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncToggleVoteThread({ threadId, voteType }) {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const userId = auth.id;

    try {
      const response = await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${threadId}/${voteType}`, { method: 'POST' });
      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        if (voteType === 'up-vote') {
          dispatch(toggleUpvoteThreadActionCreator({ threadId, userId }));
        } else if (voteType === 'down-vote') {
          dispatch(toggleDownvoteThreadActionCreator({ threadId, userId }));
        }
      }
      return responseJson;
    } catch (error) {
      alert(error.message);
      return null;
    }
  };
}

function asyncAddComment({ threadId, content }) {
  return async (dispatch) => {
    try {
      const response = await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${threadId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      const json = await response.json();
      dispatch(addCommentActionCreator({ threadId, comment: json.data.comment }));
      return json.data.comment;
    } catch (error) {
      alert(error.message);
      return null;
    }
  };
}

function asyncToggleVoteComment({ threadId, commentId, voteType }) {
  return async (dispatch, getState) => {
    const { auth } = getState();
    const userId = auth.id;

    try {
      const response = await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/${voteType}`, { method: 'POST' });
      const responseJson = await response.json();

      if (responseJson.status === 'success') {
        if (voteType === 'up-vote') {
          dispatch(toggleUpvoteCommentActionCreator({ threadId, commentId, userId }));
        } else if (voteType === 'down-vote') {
          dispatch(toggleDownvoteCommentActionCreator({ threadId, commentId, userId }));
        }
      }
      return responseJson;
    } catch (error) {
      alert(error.message);
      return null;
    }
  };
}

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  receiveThreadDetailActionCreator,
  toggleUpvoteThreadActionCreator,
  toggleDownvoteThreadActionCreator,
  addCommentActionCreator,
  toggleUpvoteCommentActionCreator,
  toggleDownvoteCommentActionCreator,
  asyncReceiveThreads,
  asyncAddThread,
  asyncReceiveThreadDetail,
  asyncToggleVoteThread,
  asyncAddComment,
  asyncToggleVoteComment,
};
