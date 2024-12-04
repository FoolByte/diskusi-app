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

    // Optimistic update
    dispatch(voteType === 'up-vote' ? toggleUpvoteThreadActionCreator({ threadId, userId }) : toggleDownvoteThreadActionCreator({ threadId, userId }));

    try {
      const response = await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${threadId}/${voteType}`, { method: 'POST' });

      const responseJson = await response.json();

      // Check response status from the API response JSON
      if (!responseJson || responseJson.status !== 'success') {
        throw new Error(responseJson?.message || 'Failed to vote thread');
      }
    } catch (error) {
      // Rollback if error
      dispatch(voteType === 'up-vote' ? toggleUpvoteThreadActionCreator({ threadId, userId }) : toggleDownvoteThreadActionCreator({ threadId, userId }));

      console.error('Vote error:', error);
      alert(error.message);
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

    // Optimistic update
    dispatch(voteType === 'up-vote' ? toggleUpvoteCommentActionCreator({ threadId, commentId, userId }) : toggleDownvoteCommentActionCreator({ threadId, commentId, userId }));

    try {
      const response = await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/${voteType}`, { method: 'POST' });
      const responseJson = await response.json();

      if (responseJson.status !== 'success') {
        dispatch(voteType === 'up-vote' ? toggleUpvoteCommentActionCreator({ threadId, commentId, userId }) : toggleDownvoteCommentActionCreator({ threadId, commentId, userId }));
      }
    } catch {
      dispatch(voteType === 'up-vote' ? toggleUpvoteCommentActionCreator({ threadId, commentId, userId }) : toggleDownvoteCommentActionCreator({ threadId, commentId, userId }));
      alert('Failed to vote comment');
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
