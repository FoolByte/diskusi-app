import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { postedAt } from '../utils/formatter';
import PropTypes from 'prop-types';
import '../styles/thread.css';

function ThreadItem({ thread, authUser, onVote }) {
  if (!thread) return null;
  const { id, title, body, category, createdAt, totalComments, upVotesBy, downVotesBy, owner } = thread;
  return (
    <article className="thread-item">
      <div className="thread-tag">#{category || 'general'}</div>
      <div className="thread-main">
        <div className="thread-meta">
          <div className="thread-author">
            <img
              src={owner?.avatar || 'https://ui-avatars.com/api/?name=Anonymous'}
              alt={owner?.name}
              className="avatar"
            />
            <div className="author-info">
              <span className="author-name">{owner?.name || 'Anonymous'}</span>
              <span className="thread-date">{postedAt(createdAt)}</span>
            </div>
          </div>
        </div>
        <h2 className="thread-title">
          <Link to={`/threads/${id}`}>{title}</Link>
        </h2>
        <div
          className="thread-body"
          dangerouslySetInnerHTML={{
            __html: body.length > 250 ? `${body.substring(0, 250)}...` : body,
          }}
        />
      </div>
      <div className="thread-footer">
        <div className="stats-group">
          <button
            className={`stat-item ${upVotesBy.includes(authUser?.id) ? 'active' : ''}`}
            onClick={() => authUser && onVote(id, 'up-vote')}
            disabled={!authUser}
            title={authUser ? 'Upvote' : 'Login to vote'}
          >
            <AiOutlineLike /> {upVotesBy.length}
          </button>
          <button
            className={`stat-item ${downVotesBy.includes(authUser?.id) ? 'active' : ''}`}
            onClick={() => authUser && onVote(id, 'down-vote')}
            disabled={!authUser}
            title={authUser ? 'Downvote' : 'Login to vote'}
          >
            <AiOutlineDislike /> {downVotesBy.length}
          </button>
          <div className="stat-item">
            <FaRegCommentDots /> {totalComments}
          </div>
        </div>
      </div>
    </article>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onVote: PropTypes.func.isRequired,
};

export default ThreadItem;
