import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import CommentItem from '../components/CommentItem';
import Loading from '../components/Loading';
import { asyncReceiveThreadDetail, asyncAddComment, asyncToggleVoteThread, asyncToggleVoteComment } from '../states/threads/action';
import { postedAt } from '../utils/formatter';
import '../styles/threadDetail.css';

function ThreadPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const thread = useSelector((state) => state.threads.find((t) => t.id === id));
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(asyncReceiveThreadDetail(id));
      setIsLoading(false);
    };
    fetchData();
  }, [id, dispatch]);

  const handleComment = async (e) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    try {
      await dispatch(asyncAddComment({ threadId: id, content: comment }));
      setComment('');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleVoteThread = async (voteType) => {
    if (!auth) {
      alert('Please login to vote');
      return;
    }

    try {
      await dispatch(asyncToggleVoteThread({ threadId: id, voteType }));
    } catch (error) {
      alert('Failed to vote thread');
    }
  };

  const handleVoteComment = async (commentId, voteType) => {
    if (!auth) {
      alert('Please login to vote');
      return;
    }

    try {
      await dispatch(asyncToggleVoteComment({ threadId: id, commentId, voteType }));
    } catch (error) {
      alert('Failed to vote comment');
    }
  };

  if (isLoading || !thread) {
    return <Loading />;
  }

  return (
    <div className="thread-detail">
      <div className="thread-content">
        <div className="thread-tag">#{thread.category || 'general'}</div>
        <div className="thread-author">
          <img
            src={thread.owner.avatar}
            alt={thread.owner.name}
            className="avatar"
          />
          <div className="author-info">
            <span>{thread.owner.name}</span>
            <span className="thread-date">{postedAt(thread.createdAt)}</span>
          </div>
        </div>

        <h1>{thread.title}</h1>
        <div
          className="thread-body"
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />

        <div className="thread-stats">
          <div className="stats-group">
            <button
              className={`stat-item ${thread.upVotesBy.includes(auth?.id) ? 'active' : ''}`}
              onClick={() => handleVoteThread('up-vote')}
              disabled={!auth}
            >
              <AiOutlineLike /> {thread.upVotesBy.length}
            </button>
            <button
              className={`stat-item ${thread.downVotesBy.includes(auth?.id) ? 'active' : ''}`}
              onClick={() => handleVoteThread('down-vote')}
              disabled={!auth}
            >
              <AiOutlineDislike /> {thread.downVotesBy.length}
            </button>
          </div>
        </div>
      </div>

      <div className="comments-section">
        {auth ? (
          <form
            onSubmit={handleComment}
            className="comment-form"
          >
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis komentarmu..."
              required
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? 'Mengirim...' : 'Kirim'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            Silakan <Link to="/login">login</Link> untuk memberikan komentar
          </p>
        )}
        <h2>Komentar ({thread.comments.length})</h2>
        {thread.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            authUser={auth}
            onVote={(voteType) => handleVoteComment(comment.id, voteType)}
          />
        ))}
      </div>
    </div>
  );
}

export default ThreadPage;
