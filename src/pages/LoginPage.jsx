import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetAuthUser } from '../states/auth/action';
import Loading from '../components/Loading';
import '../styles/auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('lastEmail');
    const savedPassword = localStorage.getItem('lastPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(asyncSetAuthUser({ email, password }));
    if (success) {
      navigate('/');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="auth-page">
      <form
        className="auth-form"
        onSubmit={onSubmit}
      >
        <h2>Login to Forum</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-submit"
        >
          Login
        </button>
        <p>
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
