import React, { useState, useContext } from "react";
import { PostContext } from "../context/PostContext";
import { CategoryContext } from "../context/CategoryContext";

const NewPost = () => {
  const { addPost } = useContext(PostContext);
  const { categories } = useContext(CategoryContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content || !category) return alert("All fields are required");

    addPost({ title, content, category });

    // Reset form
    setTitle("");
    setContent("");
    setCategory("");
  };

  return (
    <div>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default NewPost;

