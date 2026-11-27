import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get('/categories', { signal: controller.signal })
      .then((res) => setCategories(res.data))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // { keyboard: 'Bàn phím', ... } để tra tên danh mục
  const categoryNames = {};
  categories.forEach((c) => {
    categoryNames[c.id] = c.name;
  });

  return { categories, categoryNames };
}
