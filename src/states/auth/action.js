import { login, register } from '../../utils/api';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

function setAuthUser(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

function unsetAuthUser() {
  return {
    type: ActionType.UNSET_AUTH_USER,
    payload: {
      authUser: null,
    },
  };
}

function asyncSetAuthUser({ email, password }) {
  return async (dispatch) => {
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });
    try {
      const token = await login({ email, password });
      localStorage.setItem('lastEmail', email);
      localStorage.setItem('lastPassword', password);
      localStorage.setItem('token', token);
      const authUser = { token };
      dispatch(setAuthUser(authUser));
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
    }
  };
}

function asyncUnsetAuthUser() {
  return (dispatch) => {
    dispatch(unsetAuthUser());
    localStorage.removeItem('token');
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });
    try {
      await register({ name, email, password });
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
    }
  };
}

export { ActionType, setAuthUser, unsetAuthUser, asyncSetAuthUser, asyncUnsetAuthUser, asyncRegisterUser };
