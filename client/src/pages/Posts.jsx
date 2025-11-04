import React, { useContext, useEffect } from "react";
import { PostContext } from "../context/PostContext";

const Posts = () => {
  const { posts } = useContext(PostContext);

  useEffect(() => {
    console.log("Loaded posts:", posts);
  }, [posts]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Latest Posts</h2>

      {posts.length === 0 ? (
        <p style={styles.empty}>No posts available yet.</p>
      ) : (
        <div style={styles.grid}>
          {posts.map((post) => (
            <div key={post._id} style={styles.card}>
              {post.image ? (
                <img
                  src={`http://localhost:5000${
                    post.image.startsWith("/") ? post.image : `/${post.image}`
                  }`}
                  alt={post.title || "Post image"}
                  style={styles.image}
                />
              ) : (
                <div style={styles.placeholder}>No Image</div>
              )}

              <div style={styles.content}>
                <h3 style={styles.title}>{post.title}</h3>
                <p style={styles.text}>{post.content}</p>
                <small style={styles.category}>
                  Category: {post.category?.name || "Uncategorized"}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline CSS styles for simplicity
const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Work Sans, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#3a2e26",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  placeholder: {
    width: "100%",
    height: "200px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontStyle: "italic",
  },
  content: {
    padding: "15px 20px",
  },
  title: {
    margin: "0 0 10px",
    color: "#2d2d2d",
  },
  text: {
    marginBottom: "10px",
    color: "#555",
    fontSize: "0.95rem",
  },
  category: {
    color: "#888",
    fontSize: "0.85rem",
  },
  empty: {
    textAlign: "center",
    color: "#666",
  },
};

export default Posts;

