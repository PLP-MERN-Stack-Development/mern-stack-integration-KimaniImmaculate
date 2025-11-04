import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PostProvider } from "./context/PostContext";
import { CategoryProvider } from "./context/CategoryContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostProvider>
      <CategoryProvider>
        <App />
      </CategoryProvider>
    </PostProvider>
  </React.StrictMode>
);


