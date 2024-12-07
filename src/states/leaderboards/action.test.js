import { describe, it, expect } from 'vitest';
import { receiveLeaderboardsActionCreator, ActionType } from './action';

describe('Leaderboard Actions', () => {
  it('should create a receiveLeaderboardsActionCreator action', () => {
    const leaderboards = [
      { rank: 1, name: 'John Doe', score: 1000 },
      { rank: 2, name: 'Jane Smith', score: 900 },
      { rank: 3, name: 'Bob Johnson', score: 800 },
    ];
    const action = receiveLeaderboardsActionCreator(leaderboards);
    expect(action).toEqual({
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards },
    });
  });
});
