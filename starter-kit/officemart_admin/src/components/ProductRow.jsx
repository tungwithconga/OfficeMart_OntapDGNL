import { formatPrice, STATUS_LABELS } from '../utils/format';

export default function ProductRow({ product, categoryName, onEdit, onDelete }) {
  return (
    <tr data-testid="product-row">
      <td data-label="Tên">{product.name}</td>
      <td data-label="SKU">{product.sku}</td>
      <td data-label="Danh mục">{categoryName ?? product.category}</td>
      <td data-label="Giá">{formatPrice(product.price)}</td>
      <td data-label="Tồn kho">
        {product.stock === 0 ? <span className="out-of-stock">Hết hàng</span> : product.stock}
      </td>
      <td data-label="Trạng thái">
        <span data-testid="product-status" className={`badge badge-${product.status}`}>
          {STATUS_LABELS[product.status]}
        </span>
      </td>
      <td data-label="Thao tác">
        <div className="actions">
          <button type="button" data-testid="edit-button" onClick={() => onEdit?.(product)}>
            Sửa
          </button>
          <button
            type="button"
            className="danger"
            data-testid="delete-button"
            onClick={() => onDelete?.(product)}
          >
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}
