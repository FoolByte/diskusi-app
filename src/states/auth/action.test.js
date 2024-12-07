// auth.action.test.js
import { describe, it, expect } from 'vitest';
import { setAuthUser, unsetAuthUser, ActionType } from './action';

describe('Auth Actions', () => {
  it('should create a setAuthUser action', () => {
    const authUser = {
      token: 'fake-token',
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar-url',
    };
    const action = setAuthUser(authUser);
    expect(action).toEqual({
      type: ActionType.SET_AUTH_USER,
      payload: { authUser },
    });
  });

  it('should create an unsetAuthUser action', () => {
    const action = unsetAuthUser();
    expect(action).toEqual({
      type: ActionType.UNSET_AUTH_USER,
      payload: { authUser: null },
    });
  });
});
