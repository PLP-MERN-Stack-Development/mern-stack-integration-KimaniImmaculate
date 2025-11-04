import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import NewPost from "./pages/NewPost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Posts />} />
         <Route path="/posts/:id" element={<Post />} />
        <Route path="/new" element={<NewPost />} />
      </Routes>
    </Router>
  );
}

export default App;



