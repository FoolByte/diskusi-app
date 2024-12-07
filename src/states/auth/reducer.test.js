import { describe, it, expect } from 'vitest';
import { setAuthUser, unsetAuthUser, ActionType } from './action';
import authReducer from './reducer';

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

describe('Auth Reducer', () => {
  it('should handle SET_AUTH_USER action', () => {
    const authUser = {
      token: 'fake-token',
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar-url',
    };
    const newState = authReducer(null, { type: ActionType.SET_AUTH_USER, payload: { authUser } });
    expect(newState).toEqual(authUser);
  });

  it('should handle UNSET_AUTH_USER action', () => {
    const newState = authReducer({ token: 'fake-token' }, { type: ActionType.UNSET_AUTH_USER, payload: { authUser: null } });
    expect(newState).toBeNull();
  });
});
