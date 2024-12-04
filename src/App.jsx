import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreateThreadPage from './pages/CreateThreadPage';
import ThreadPage from './pages/ThreadPage';
import Loading from './components/Loading';
import { asyncUnsetAuthUser } from './states/auth/action';

function App() {
  const isLoading = useSelector((states) => states.isLoading || false);
  const auth = useSelector((states) => states.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(asyncUnsetAuthUser());
    }
  }, [dispatch]);

  return (
    <>
      <header>
        <Navigation />
      </header>
      {isLoading && <Loading />}
      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/leaderboard"
            element={<LeaderboardPage />}
          />
          <Route
            path="/threads/:id"
            element={<ThreadPage />}
          />
          {auth && (
            <Route
              path="/new"
              element={<CreateThreadPage />}
            />
          )}
        </Routes>
      </main>
    </>
  );
}

export default App;
