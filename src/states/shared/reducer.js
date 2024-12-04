import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/reducer';
import threadsReducer from '../threads/reducer';
import usersReducer from '../users/reducer';
import leaderboardsReducer from '../leaderboards/reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    users: usersReducer,
    leaderboards: leaderboardsReducer,
    isLoading: (state = false, action) => {
      switch (action.type) {
      case 'SET_IS_LOADING':
        return action.payload.isLoading;
      default:
        return state;
      }
    },
  },
});

export default store;
