import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import useProductSearch from '../hooks/useProductSearch';
import useCategories from '../hooks/useCategories';
import { useToast } from '../context/ToastContext';

const LIMIT = 10;
const VALID_STATUS = ['active', 'inactive'];

export default function ProductListPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { categories, categoryNames } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();

    // ---- URL là nguồn sự thật duy nhất (4.3.3) ----
    const q = (searchParams.get('q') ?? '').trim();
    const category = searchParams.get('category') ?? '';
    const statusParam = searchParams.get('status') ?? '';
    const status = VALID_STATUS.includes(statusParam) ? statusParam : '';
    const rawPage = Number(searchParams.get('page'));
    const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1; // page=-3, page=abc -> 1

    const { data, total, loading, error, reload } = useProductSearch({
        q, category, status, page, limit: LIMIT,
    });
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    // Cập nhật URL dựa trên URL mới nhất (prev), tránh timer debounce ghi đè bộ lọc vừa đổi.
    // Bỏ tham số rỗng và page=1 cho URL gọn.
    function updateParams(changes) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(changes).forEach(([k, v]) => {
                const s = String(v ?? '');
                if (s === '' || (k === 'page' && s === '1')) next.delete(k);
                else next.set(k, s);
            });
            return next;
        });
    }

    // ---- Ô tìm kiếm: state riêng + debounce 400ms (4.3.1) ----
    const [keyword, setKeyword] = useState(q);

    // Back/Forward hoặc mở URL có sẵn: đồng bộ ô nhập theo URL
    useEffect(() => {
        setKeyword(q);
    }, [q]);

    useEffect(() => {
        const trimmed = keyword.trim(); // chỉ khoảng trắng -> coi như rỗng
        if (trimmed === q) return;
        const timer = setTimeout(() => {
            updateParams({ q: trimmed, page: 1 }); // đổi từ khoá -> về trang 1
        }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    // page=999 vượt quá số trang -> đưa về trang cuối
    useEffect(() => {
        if (!loading && !error && total > 0 && page > totalPages) {
            updateParams({ page: totalPages });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, error, total, page, totalPages]);

    // ---- Xoá (4.2.5) ----
    const [deleting, setDeleting] = useState(null); // sản phẩm đang chờ xác nhận
    const [deleteBusy, setDeleteBusy] = useState(false);

    async function confirmDelete() {
        setDeleteBusy(true);
        try {
            await api.delete(`/products/${deleting.id}`);
            setDeleting(null);
            showToast('Đã xoá sản phẩm');
            reload();
        } catch (err) {
            showToast(err.response?.data?.message ?? 'Xoá thất bại');
        } finally {
            setDeleteBusy(false);
        }
    }

    return (
        <section>
            <div className="page-head">
                <h1>Sản phẩm</h1>
                <button
                    type="button"
                    className="primary"
                    data-testid="add-button"
                    onClick={() => navigate('/products/new')}
                >
                    Thêm sản phẩm
                </button>
            </div>

            <div className="filters">
                <input
                    type="search"
                    placeholder="Tìm theo tên hoặc SKU"
                    aria-label="Tìm kiếm"
                    data-testid="search-input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <select
                    aria-label="Danh mục"
                    data-testid="category-filter"
                    value={category}
                    onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
                >
                    <option value="">Tất cả</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select
                    aria-label="Trạng thái"
                    data-testid="status-filter"
                    value={status}
                    onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
                >
                    <option value="">Tất cả</option>
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ngừng bán</option>
                </select>
            </div>

            {loading && <p className="loading" data-testid="loading">Đang tải...</p>}

            {!loading && error && (
                <div className="error-box">
                    <p data-testid="error-message">Lỗi: {error}</p>
                    <button type="button" data-testid="retry-button" onClick={reload}>
                        Thử lại
                    </button>
                </div>
            )}

            {!loading && !error && data.length === 0 && (
                <p className="empty" data-testid="empty-state">Không có sản phẩm nào.</p>
            )}

            {!loading && !error && data.length > 0 && (
                <>
                    <ProductTable
                        products={data}
                        categoryNames={categoryNames}
                        onEdit={(p) => navigate(`/products/${p.id}/edit`)}
                        onDelete={(p) => setDeleting(p)}
                    />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={(p) => updateParams({ page: p })}
                    />
                </>
            )}

            {deleting && (
                <ConfirmDialog
                    message={`Xoá sản phẩm "${deleting.name}"?`}
                    busy={deleteBusy}
                    onNo={() => setDeleting(null)}
                    onYes={confirmDelete}
                />
            )}
        </section>
    );
}
