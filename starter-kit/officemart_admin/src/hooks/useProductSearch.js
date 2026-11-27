import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

// Hook đã sửa (Mục 4.3.4 c)
// - Mỗi lần tham số đổi: effect cũ chạy cleanup -> controller.abort() huỷ request cũ
// - Request bị huỷ rơi vào catch với CanceledError -> bỏ qua, KHÔNG set state
//   => response cũ (chậm) không thể ghi đè kết quả của từ khoá mới nhất
export default function useProductSearch({ q, category, status, page, limit = 10 }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const params = { page, limit };
    if (q) params.q = q;
    if (category) params.category = category;
    if (status) params.status = status;

    setLoading(true);
    setError(null);

    api
      .get('/products', { params, signal: controller.signal })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        setError(err.response?.data?.message ?? err.message ?? 'Có lỗi xảy ra');
        setLoading(false);
      });

    return () => controller.abort();
  }, [q, category, status, page, limit, reloadKey]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  return { data, total, loading, error, reload };
}
