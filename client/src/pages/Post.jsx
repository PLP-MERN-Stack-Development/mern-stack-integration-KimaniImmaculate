import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postService } from "../services/api";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(id);
        setPost(data);
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <p style={{ textAlign: "center" }}>Loading post...</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        ← Back to Posts
      </button>

      <h1 style={styles.title}>{post.title}</h1>

      {post.image && (
        <img
          src={`http://localhost:5000${
            post.image.startsWith("/") ? post.image : `/${post.image}`
          }`}
          alt={post.title}
          style={styles.image}
        />
      )}

      <p style={styles.content}>{post.content}</p>

      <p style={styles.category}>
        Category: {post.category?.name || "Uncategorized"}
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Work Sans, sans-serif",
  },
  backBtn: {
    backgroundColor: "#7b5e4b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "0.9rem",
    transition: "background 0.2s ease",
  },
  title: {
    color: "#3a2e26",
    textAlign: "center",
    marginBottom: "20px",
  },
  image: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  content: {
    fontSize: "1rem",
    color: "#333",
    lineHeight: "1.6",
  },
  category: {
    marginTop: "20px",
    fontStyle: "italic",
    color: "#666",
  },
};

export default Post;

