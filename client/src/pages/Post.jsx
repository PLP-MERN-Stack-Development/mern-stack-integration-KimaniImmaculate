// src/pages/Post.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { postService } from '../services/api';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await postService.getPost(id);
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to comment');
    try {
      const res = await api.post(`/posts/${id}/comments`, { content: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // res is populated comments, refresh post
      const updated = await postService.getPost(id);
      setPost(updated);
      setComment('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <button onClick={() => navigate('/')}>← Back</button>
      <h1>{post.title}</h1>
      {post.image && <img src={`http://localhost:5000${post.image}`} alt={post.title} style={{ width: '100%', borderRadius: 8 }} />}
      <p>{post.content}</p>
      <p><em>Category: {post.category?.name}</em></p>

      <hr />

      <h3>Comments</h3>
      {post.comments && post.comments.length ? (
        post.comments.map(c => (
          <div key={c._id} style={{ borderBottom: '1px solid #eee', padding: '6px 0' }}>
            <strong>{c.user?.username || 'Unknown'}</strong>
            <p>{c.content}</p>
          </div>
        ))
      ) : <p>No comments yet</p>}

      <form onSubmit={submitComment} style={{ marginTop: 12 }}>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}


