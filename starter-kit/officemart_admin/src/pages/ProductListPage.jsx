// PHIÊN BẢN MỤC 4.1 (commit P1:) — dùng dữ liệu mẫu, chưa gọi API.
// Khi làm 4.1: trong App.jsx import trang này thay cho ProductListPage.

import sampleProducts, { categoryNames } from '../data/sample';
import ProductTable from '../components/ProductTable';

export default function ProductListPageP1() {
  return (
    <section>
      <div className="page-head">
        <h1>Sản phẩm</h1>
        <button type="button" className="primary" data-testid="add-button">
          Thêm sản phẩm
        </button>
      </div>
      <ProductTable products={sampleProducts} categoryNames={categoryNames} />
    </section>
  );
}
