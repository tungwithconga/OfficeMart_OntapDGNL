import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import ProductForm from '../components/ProductForm';
import useCategories from '../hooks/useCategories';
import { useToast } from '../context/ToastContext';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categories } = useCategories();

  async function handleCreate(payload) {
    await api.post('/products', payload); // lỗi sẽ được ProductForm bắt
    showToast('Đã thêm sản phẩm');
    navigate('/products');
  }

  return (
    <section>
      <Link to="/products" className="back-link">← Danh sách</Link>
      <h1>Thêm sản phẩm</h1>
      <ProductForm categories={categories} onSubmit={handleCreate} />
    </section>
  );
}
