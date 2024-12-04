import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';
import '../styles/leaderboard.css';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(asyncReceiveLeaderboards());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span className="rank">Rank</span>
          <span className="user">User</span>
          <span className="score">Score</span>
        </div>
        {leaderboards.map((leader, index) => (
          <div
            key={leader.user.id}
            className="leaderboard-item"
          >
            <span className="rank">{index + 1}</span>
            <div className="user">
              <img
                src={leader.user.avatar}
                alt={leader.user.name}
                className="avatar"
              />
              <span>{leader.user.name}</span>
            </div>
            <span className="score">{leader.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPage;
