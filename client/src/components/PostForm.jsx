import React, { useContext, useState } from "react";
import { PostContext } from "../context/PostContext";
import { CategoryContext } from "../context/CategoryContext";

const PostForm = () => {
  const { addPost } = useContext(PostContext);
  const { categories } = useContext(CategoryContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) return alert("All fields required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await addPost(formData);
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      alert("Post created successfully!");
    } catch (err) {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>
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
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
