const ActionType = {
  RECEIVE_LEADERBOARDS: 'RECEIVE_LEADERBOARDS',
};

function receiveLeaderboardsActionCreator(leaderboards) {
  return {
    type: ActionType.RECEIVE_LEADERBOARDS,
    payload: {
      leaderboards,
    },
  };
}

function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    try {
      const response = await fetch('https://forum-api.dicoding.dev/v1/leaderboards');
      const json = await response.json();
      dispatch(receiveLeaderboardsActionCreator(json.data.leaderboards));
    } catch (error) {
      alert(error.message);
    }
  };
}

export { ActionType, receiveLeaderboardsActionCreator, asyncReceiveLeaderboards };
