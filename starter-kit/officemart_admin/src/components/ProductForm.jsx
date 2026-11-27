import { useState } from 'react';
import { validateProduct } from '../utils/validate';

const EMPTY = { name: '', sku: '', category: '', price: '', stock: '', status: 'active' };
const FIELDS = ['name', 'sku', 'category', 'price', 'stock', 'status'];

// onSubmit(payload) trả về Promise; nếu lỗi thì throw lỗi axios để form hiển thị
export default function ProductForm({ initialValues, categories, onSubmit, submitLabel = 'Lưu' }) {
  const [values, setValues] = useState(() => {
    const start = { ...EMPTY };
    if (initialValues) {
      FIELDS.forEach((f) => {
        if (initialValues[f] !== undefined && initialValues[f] !== null)
          start[f] = String(initialValues[f]);
      });
    }
    return start;
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const found = validateProduct(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return; // sai thì không gọi API

    const payload = {
      name: values.name.trim(),
      sku: values.sku.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      status: values.status,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      // thành công: trang cha sẽ navigate, không cần setSubmitting(false)
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if ((status === 409 || status === 400) && data?.field) {
        setErrors({ [data.field]: data.message }); // giữ nguyên values
      } else {
        setFormError(data?.message ?? 'Không lưu được, vui lòng thử lại');
      }
      setSubmitting(false);
    }
  }

  function fieldError(name) {
    return errors[name] ? (
      <p className="field-error" data-testid={`field-error-${name}`}>
        {errors[name]}
      </p>
    ) : null;
  }

  return (
    <form className="product-form" data-testid="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">Tên sản phẩm</label>
        <input id="name" name="name" value={values.name} onChange={handleChange} />
        {fieldError('name')}
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" placeholder="ABC-1234" value={values.sku} onChange={handleChange} />
        {fieldError('sku')}
      </div>

      <div className="form-group">
        <label htmlFor="category">Danh mục</label>
        <select id="category" name="category" value={values.category} onChange={handleChange}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {fieldError('category')}
      </div>

      <div className="form-group">
        <label htmlFor="price">Giá (₫)</label>
        <input id="price" name="price" type="number" value={values.price} onChange={handleChange} />
        {fieldError('price')}
      </div>

      <div className="form-group">
        <label htmlFor="stock">Tồn kho</label>
        <input id="stock" name="stock" type="number" value={values.stock} onChange={handleChange} />
        {fieldError('stock')}
      </div>

      <div className="form-group">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" value={values.status} onChange={handleChange}>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
        {fieldError('status')}
      </div>

      {formError && <p className="field-error">{formError}</p>}

      <button type="submit" className="primary" data-testid="submit-button" disabled={submitting}>
        {submitting ? 'Đang lưu...' : submitLabel}
      </button>
    </form>
  );
}
