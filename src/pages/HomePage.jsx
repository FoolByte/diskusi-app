import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ThreadItem from '../components/ThreadItem';
import Loading from '../components/Loading';
import { asyncReceiveUsers } from '../states/users/action';
import { asyncReceiveThreads } from '../states/threads/action';
import { voteThread } from '../utils/api';
import '../styles/home.css';

function HomePage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);
  const threads = useSelector((state) => state.threads);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([dispatch(asyncReceiveUsers()), dispatch(asyncReceiveThreads())]);
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const uniqueCategories = [...new Set(threads.map((thread) => thread.category))];
    setCategories(['all', ...uniqueCategories.filter((category) => category)]);
  }, [threads]);

  const handleVote = async (threadId, voteType) => {
    if (!auth) {
      alert('Please login to vote');
      return;
    }

    try {
      await voteThread(threadId, voteType);
      dispatch(asyncReceiveThreads());
    } catch (error) {
      alert('Failed to vote thread', error);
    }
  };

  const threadsWithUsers = useMemo(() => {
    const filteredThreads = selectedCategory === 'all' ? threads : threads.filter((thread) => thread.category === selectedCategory);

    return filteredThreads.map((thread) => ({
      ...thread,
      owner: users.find((user) => user.id === thread.ownerId) || thread.owner,
    }));
  }, [threads, users, selectedCategory]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="home-page">
      <div className="thread-list">
        <div className="thread-list-header">
          <div className="header-content">
            <h2>Discussion Threads</h2>
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {auth && (
            <Link
              to="/new"
              className="btn-create"
            >
              Create Thread
            </Link>
          )}
        </div>

        {threadsWithUsers.length > 0 ? (
          threadsWithUsers.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              authUser={auth}
              onVote={handleVote}
            />
          ))
        ) : (
          <div className="no-threads">
            <p>No threads found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
