// src/context/PostContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { postService } from '../services/api';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [postsData, setPostsData] = useState({ posts: [], total: 0, page: 1, pages: 1 });

  const fetchPosts = async (opts = { page: 1, limit: 10, search: '', category: '' }) => {
    const params = new URLSearchParams(opts).toString();
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/posts?${params}`);
    const data = await res.json();
    setPostsData({ posts: data.posts, total: data.total, page: data.page, pages: data.pages });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (postData, hasImage = true) => {
    const newPost = await postService.createPost(postData, hasImage);
    setPostsData(prev => ({ ...prev, posts: [newPost, ...prev.posts] }));
  };

  return (
    <PostContext.Provider value={{ ...postsData, fetchPosts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};



