// src/pages/Posts.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import PostForm from '../components/PostForm';

export default function Posts() {
  const { posts, total, page, pages, fetchPosts } = useContext(PostContext);
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => { /* initial fetch is done by context */ }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts({ page: 1, limit: 10, search: q, category: categoryFilter });
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <h2>All Posts</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
        <input value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} placeholder="Category id (optional)" />
        <button type="submit">Search</button>
      </form>

      <PostForm />

      <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
        {posts && posts.length ? posts.map(p => (
          <Link to={`/posts/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
              {p.image ? <img src={`http://localhost:5000${p.image}`} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 6 }} /> : null}
              <h3>{p.title}</h3>
              <p>{p.content.slice(0, 120)}{p.content.length > 120 ? '...' : ''}</p>
              <small>Category: {p.category?.name}</small>
            </div>
          </Link>
        )) : <p>No posts</p>}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => fetchPosts({ page: Math.max(1, page - 1) })} disabled={page <= 1}>Prev</button>
        <span style={{ margin: '0 12px' }}>Page {page} / {pages}</span>
        <button onClick={() => fetchPosts({ page: Math.min(pages, page + 1) })} disabled={page >= pages}>Next</button>
      </div>
    </div>
  );
}


