import { describe, it, expect } from 'vitest';
import leaderboardsReducer from './reducer';
import { ActionType } from './action';

describe('Leaderboard Reducer', () => {
  it('should handle RECEIVE_LEADERBOARDS action', () => {
    const leaderboards = [
      { rank: 1, name: 'John Doe', score: 1000 },
      { rank: 2, name: 'Jane Smith', score: 900 },
      { rank: 3, name: 'Bob Johnson', score: 800 },
    ];
    const newState = leaderboardsReducer([], { type: ActionType.RECEIVE_LEADERBOARDS, payload: { leaderboards } });
    expect(newState).toEqual(leaderboards);
  });

  it('should return the current state for unknown actions', () => {
    const currentState = [
      { rank: 1, name: 'John Doe', score: 1000 },
      { rank: 2, name: 'Jane Smith', score: 900 },
    ];
    const newState = leaderboardsReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toEqual(currentState);
  });
});
