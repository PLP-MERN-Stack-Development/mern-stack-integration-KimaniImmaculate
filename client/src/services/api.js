// api.js - API service for making requests to the backend

import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

//
// 🧱 POST SERVICES
//
export const postService = {
  // ✅ Get all posts
  getAllPosts: async () => {
    const res = await api.get("/posts");
    return res.data;
  },

  // ✅ Get a single post by ID
  getPost: async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  // ✅ Create post — handles both JSON and FormData (for image upload)
  createPost: async (postData, hasImage = false) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': hasImage ? 'multipart/form-data' : 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };

  const res = await api.post('/posts', postData, config);
  return res.data;
},
};

//
// 🧱 CATEGORY SERVICES
//
export const categoryService = {
  getAllCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
};

//
// 🧱 AUTH SERVICES
//
export const authService = {
  register: async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default api;
