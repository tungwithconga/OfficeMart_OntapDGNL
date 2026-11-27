// 1290000 -> "1.290.000 ₫"
export function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
}

export const STATUS_LABELS = {
  active: 'Đang bán',
  inactive: 'Ngừng bán',
};
