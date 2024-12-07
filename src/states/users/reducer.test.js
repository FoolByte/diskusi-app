import { describe, it, expect } from 'vitest';
import usersReducer from './reducer';
import { ActionType } from './action';

describe('Users Reducer', () => {
  it('should handle RECEIVE_USERS action', () => {
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ];
    const newState = usersReducer([], { type: ActionType.RECEIVE_USERS, payload: { users } });
    expect(newState).toEqual(users);
  });

  it('should return the current state for unknown actions', () => {
    const currentState = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const newState = usersReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toEqual(currentState);
  });

  it('should handle an empty action payload', () => {
    const newState = usersReducer([], { type: ActionType.RECEIVE_USERS, payload: { users: [] } });
    expect(newState).toEqual([]);
  });
});
