// src/components/PostForm.jsx
import React, { useContext, useState } from 'react';
import { PostContext } from '../context/PostContext';

export default function PostForm() {
  const { addPost } = useContext(PostContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) return alert('All fields required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (image) formData.append('image', image);

    await addPost(formData, true);
    setTitle(''); setContent(''); setCategory(''); setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'grid', gap: 8 }}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
      <input placeholder="Category id" value={category} onChange={e=>setCategory(e.target.value)} />
      <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
      <button type="submit">Create Post</button>
    </form>
  );
}

