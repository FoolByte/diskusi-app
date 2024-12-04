import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import CommentItem from '../components/CommentItem';
import Loading from '../components/Loading';
import { fetchWithAuth } from '../utils/api';
import { postedAt } from '../utils/formatter';
import '../styles/threadDetail.css';

function ThreadPage() {
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);
  const [thread, setThread] = useState(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await fetch(`https://forum-api.dicoding.dev/v1/threads/${id}`);
        const json = await response.json();
        setThread(json.data.detailThread);
      } catch (error) {
        console.error('Error fetching thread:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    try {
      const response = await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });
      const json = await response.json();
      setThread({
        ...thread,
        comments: [json.data.comment, ...thread.comments],
      });
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
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

    const oldThread = { ...thread };
    const userId = auth.id;

    if (voteType === 'up-vote') {
      if (thread.upVotesBy.includes(userId)) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        voteType = 'neutral-vote';
      } else {
        thread.upVotesBy = [...thread.upVotesBy, userId];
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      }
    } else if (voteType === 'down-vote') {
      if (thread.downVotesBy.includes(userId)) {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        voteType = 'neutral-vote';
      } else {
        thread.downVotesBy = [...thread.downVotesBy, userId];
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      }
    }

    setThread({ ...thread });

    try {
      await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${id}/${voteType}`, { method: 'POST' });
    } catch (error) {
      setThread(oldThread);
      alert('Failed to vote thread', error);
    }
  };

  const handleVoteComment = async (commentId, voteType) => {
    if (!auth) {
      alert('Please login to vote');
      return;
    }

    const oldComments = [...thread.comments];
    const commentIndex = oldComments.findIndex((c) => c.id === commentId);
    const comment = oldComments[commentIndex];
    const userId = auth.id;

    if (voteType === 'up-vote') {
      if (comment.upVotesBy.includes(userId)) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        voteType = 'neutral-vote';
      } else {
        comment.upVotesBy = [...comment.upVotesBy, userId];
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      }
    } else if (voteType === 'down-vote') {
      if (comment.downVotesBy.includes(userId)) {
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        voteType = 'neutral-vote';
      } else {
        comment.downVotesBy = [...comment.downVotesBy, userId];
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      }
    }

    setThread({ ...thread, comments: oldComments });

    try {
      await fetchWithAuth(`https://forum-api.dicoding.dev/v1/threads/${id}/comments/${commentId}/${voteType}`, { method: 'POST' });
    } catch (error) {
      setThread({ ...thread, comments: thread.comments });
      alert('Failed to vote comment', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!thread) {
    return <div>Thread not found</div>;
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
