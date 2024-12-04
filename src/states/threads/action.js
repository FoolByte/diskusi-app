import { fetchWithAuth } from '../../utils/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  TOGGLE_LIKE_THREAD: 'TOGGLE_LIKE_THREAD',
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

export { ActionType, receiveThreadsActionCreator, addThreadActionCreator, asyncAddThread, asyncReceiveThreads };
