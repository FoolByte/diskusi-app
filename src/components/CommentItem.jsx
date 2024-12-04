import React from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { postedAt } from '../utils/formatter';
import PropTypes from 'prop-types';
import '../styles/comment.css';

function CommentItem({ comment, authUser, onVote }) {
  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <img
            src={comment.owner.avatar}
            alt={comment.owner.name}
            className="avatar"
          />
          <div className="author-info">
            <span className="author-name">{comment.owner.name}</span>
            <span className="comment-date">{postedAt(comment.createdAt)}</span>
          </div>
        </div>
      </div>
      <div
        className="comment-content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <div className="comment-actions">
        <button
          className={`stat-item ${comment.upVotesBy.includes(authUser?.id) ? 'active' : ''}`}
          onClick={() => onVote('up-vote')}
          disabled={!authUser}
        >
          <AiOutlineLike /> {comment.upVotesBy.length}
        </button>
        <button
          className={`stat-item ${comment.downVotesBy.includes(authUser?.id) ? 'active' : ''}`}
          onClick={() => onVote('down-vote')}
          disabled={!authUser}
        >
          <AiOutlineDislike /> {comment.downVotesBy.length}
        </button>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    owner: PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onVote: PropTypes.func.isRequired,
};

export default CommentItem;
