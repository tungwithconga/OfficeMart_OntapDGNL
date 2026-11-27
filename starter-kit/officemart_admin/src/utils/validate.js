const SKU_REGEX = /^[A-Z]{3}-\d{4}$/;

// Trả về object lỗi { tenTruong: 'thông báo' }; rỗng nghĩa là hợp lệ
export function validateProduct(values) {
  const errors = {};

  const name = values.name.trim();
  if (!name) errors.name = 'Vui lòng nhập tên sản phẩm';
  else if (name.length < 3 || name.length > 100)
    errors.name = 'Tên phải từ 3 đến 100 ký tự';

  const sku = values.sku.trim();
  if (!sku) errors.sku = 'Vui lòng nhập SKU';
  else if (!SKU_REGEX.test(sku))
    errors.sku = 'SKU phải có dạng ABC-1234 (3 chữ in hoa, dấu -, 4 chữ số)';

  if (!values.category) errors.category = 'Vui lòng chọn danh mục';

  // Number('') = 0 nên phải kiểm tra chuỗi rỗng riêng
  const priceStr = String(values.price).trim();
  const price = Number(priceStr);
  if (priceStr === '' || Number.isNaN(price) || price <= 0)
    errors.price = 'Giá phải là số lớn hơn 0';

  const stockStr = String(values.stock).trim();
  const stock = Number(stockStr);
  if (stockStr === '' || !Number.isInteger(stock) || stock < 0)
    errors.stock = 'Tồn kho phải là số nguyên không âm';

  return errors;
}
