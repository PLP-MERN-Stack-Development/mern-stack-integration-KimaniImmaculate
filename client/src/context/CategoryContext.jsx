import { createContext, useState, useEffect } from "react";
import { categoryService } from "../services/api";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        setLoadingCategories(false);
      } catch (err) {
        console.error(err);
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, setCategories, loadingCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
