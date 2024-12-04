import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncUnsetAuthUser } from '../states/auth/action';
import '../styles/navigation.css';

function Navigation() {
  const authUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(asyncUnsetAuthUser());
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        <h1>
          <Link to="/">Forum Diskusi</Link>
        </h1>
      </div>
      <div className="nav-menu">
        <Link
          to="/"
          className="nav-item"
        >
          Threads
        </Link>
        <Link
          to="/leaderboard"
          className="nav-item"
        >
          Leaderboard
        </Link>
        {authUser ? (
          <button
            onClick={onLogout}
            className="nav-item btn-logout"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="nav-item"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
