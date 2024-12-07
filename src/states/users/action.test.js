import { describe, it, expect } from 'vitest';
import { receiveUsersActionCreator, ActionType } from './action';

describe('Users Actions', () => {
  it('should create a receiveUsersActionCreator action', () => {
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ];
    const action = receiveUsersActionCreator(users);
    expect(action).toEqual({
      type: ActionType.RECEIVE_USERS,
      payload: { users },
    });
  });

  it('should handle an empty users array', () => {
    const action = receiveUsersActionCreator([]);
    expect(action).toEqual({
      type: ActionType.RECEIVE_USERS,
      payload: { users: [] },
    });
  });

  it('should handle a single user object', () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const action = receiveUsersActionCreator([user]);
    expect(action).toEqual({
      type: ActionType.RECEIVE_USERS,
      payload: { users: [user] },
    });
  });
});
