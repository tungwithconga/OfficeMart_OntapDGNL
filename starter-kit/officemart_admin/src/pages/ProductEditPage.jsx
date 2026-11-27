import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient';
import ProductForm from '../components/ProductForm';
import useCategories from '../hooks/useCategories';
import { useToast } from '../context/ToastContext';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categories } = useCategories();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    api
      .get(`/products/${id}`, { signal: controller.signal })
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'CanceledError') return;
        setError(
          err.response?.status === 404
            ? 'Không tìm thấy sản phẩm'
            : err.response?.data?.message ?? 'Có lỗi xảy ra'
        );
        setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  async function handleUpdate(payload) {
    await api.put(`/products/${id}`, payload);
    showToast('Đã cập nhật sản phẩm');
    navigate('/products');
  }

  return (
    <section>
      <Link to="/products" className="back-link">← Danh sách</Link>
      <h1>Sửa sản phẩm</h1>
      {loading && <p data-testid="loading">Đang tải...</p>}
      {!loading && error && (
        <div className="error-box" data-testid="error-message">{error}</div>
      )}
      {!loading && product && (
        // key=id để form khởi tạo lại khi đổi sản phẩm
        <ProductForm
          key={product.id}
          initialValues={product}
          categories={categories}
          onSubmit={handleUpdate}
        />
      )}
    </section>
  );
}
