import React, { createContext, useState, useEffect } from "react";
import { postService } from "../services/api";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await postService.getAllPosts();
      setPosts(data);
    };
    fetchPosts();
  }, []);

const addPost = async (postData) => {
  try {
    const newPost = await postService.createPost(postData, true); // pass true for FormData
    setPosts((prev) => [newPost, ...prev]);
  } catch (err) {
    console.error(err);
    alert("Failed to create post");
  }
};

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};


