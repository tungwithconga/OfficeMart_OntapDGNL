# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:**
- **Lớp:**
- **Link repository:**
- **Hệ điều hành (Windows/macOS):**
- **Mã commit P2 đã nộp trước phút 90 (gõ `git log --oneline -1`):**
- **Phiên bản Node.js (gõ `node -v`):**

## 4.1. Giao diện danh sách sản phẩm

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin. Đánh dấu `[x]` vào các mục đã làm để tự kiểm tra.

- [x] 4.1.1. Bố cục trang
- [x] 4.1.2. Bảng sản phẩm
- [x] 4.1.3. Định dạng dữ liệu
- [x] 4.1.4. Hiển thị trên điện thoại

## 4.2. Thêm, sửa, xoá sản phẩm qua API

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin.

- [x] 4.2.1. Tải danh sách
- [x] 4.2.2. Form thêm sản phẩm
- [x] 4.2.3. Gửi form
- [x] 4.2.4. Sửa sản phẩm
- [x] 4.2.5. Xoá sản phẩm

## 4.3. Tìm kiếm, lọc và phân trang

> Pha 2 – mức AI-2 (được dùng AI, ghi nhật ký ở Mục 4.3.5).

> Mục 4.3.1 đến 4.3.3 và ý c của Mục 4.3.4 chấm trực tiếp trên mã nguồn.

- [x] 4.3.1. Tìm kiếm và lọc
- [x] 4.3.2. Phân trang
- [x] 4.3.3. Đồng bộ URL

### 4.3.4. Phản biện mã do AI sinh

#### a) Thao tác làm danh sách hiển thị sai

Các bước thao tác:

```text
1. Trong src/pages/ProductListPage.jsx tạm đổi import sang hook AI:
   import useProductSearch from '../ai/useProductSearch_ai';
2. Chạy API bằng npm run api:cham (q bắt đầu bằng "ban" trễ 2,5 giây, request khác 0,1 giây),
   chạy npm run dev, mở http://localhost:5173/products, mở DevTools > Network.
3. Gõ "ban" vào ô tìm kiếm, chờ khoảng nửa giây cho request ?q=ban được gửi (đang treo).
4. Ngay lập tức xoá hết và gõ "chuot", chờ 3 giây.
```

Kết quả hiển thị:

```text
- Ô tìm kiếm là "chuot", URL là ?q=chuot.
- Sau khoảng 0,1 giây danh sách hiện đúng các sản phẩm chuột (24 sản phẩm, dòng đầu
  "Chuột trackball T50 Pro").
- Khoảng 2 giây sau danh sách tự đổi sang các sản phẩm "Bàn ..." (48 sản phẩm, dòng đầu
  "Bàn làm việc trẻ em Pro") – kết quả của từ khoá cũ "ban", trong khi ô tìm kiếm vẫn là "chuot".
- Network: request ?q=ban vẫn chạy hết 2,5 giây, không bị huỷ.
```

Kết quả đúng:

```text
Danh sách luôn là kết quả của từ khoá mới nhất "chuot" (24 sản phẩm chuột) và giữ nguyên như vậy;
request ?q=ban cũ phải bị huỷ hoặc bị bỏ qua.
```

#### b) Vì sao hook hiển thị sai

Hook bị race condition: mỗi lần tham số đổi, useEffect gửi một request mới nhưng không có hàm cleanup để huỷ request cũ, và cũng không kiểm tra response trả về có còn ứng với tham số hiện tại hay không. Vì vậy request nào **về sau cùng** thì `setData` sau cùng và thắng, chứ không phải request **gửi sau cùng**: request "ban" (2,5 giây) về sau request "chuot" (0,1 giây) nên ghi đè danh sách đúng. Mạng nhanh thì các response về đúng thứ tự gửi nên không thấy lỗi. (Ngoài ra hook còn hiển thị `err.message` của axios thay vì message của server.)

#### c) Hook đã sửa

> Chấm trực tiếp trên file src/hooks/useProductSearch.js và trang danh sách.

Mỗi lần effect chạy tạo `new AbortController()` và truyền `signal` vào `api.get`. Hàm cleanup `return () => controller.abort()` chạy khi tham số đổi hoặc component unmount nên request cũ bị huỷ. Request bị huỷ ném `CanceledError`, trong `catch` bỏ qua, không gọi `setData`/`setError`. Hook còn trả về `reload()` cho nút "Thử lại" và lấy `err.response.data.message` khi lỗi.

### 4.3.5. Nhật ký dùng AI (giữ – sửa – loại bỏ)

> Ghi ít nhất 2 lần dùng AI có ảnh hưởng đến mã nộp. Không dùng AI trong Pha 2 thì xoá bảng và ghi "Không sử dụng AI trong Pha 2".

| Lần | Câu lệnh chính gửi cho AI | Đoạn mã hoặc ý AI đưa ra (file) | Quyết định (giữ/sửa/loại bỏ) | Lý do | Bằng chứng kiểm chứng (chạy thử gì, kết quả) |
|---|---|---|---|---|---|
| 1 | "Viết trang danh sách có tìm kiếm debounce 400 ms, lọc danh mục, trạng thái, phân trang và đồng bộ lên URL bằng useSearchParams" | Hàm `updateParams` trong `src/pages/ProductListPage.jsx` ghép tham số từ biến của lần render rồi gọi `setSearchParams(object)` | **Sửa** | Timer debounce giữ giá trị `category`/`status` cũ của lần render lúc bắt đầu gõ; nếu đổi bộ lọc trong 400 ms chờ thì timer ghi đè lại bộ lọc cũ. Đổi sang `setSearchParams(prev => ...)` để luôn dựa trên URL mới nhất, xoá tham số rỗng và `page=1` | Gõ liền "ban": tab Network chỉ có 1 request `q=ban`. Chọn danh mục Chuột rồi gõ "k" và đổi trạng thái ngay trong 400 ms: URL giữ đủ `category=mouse&status=...&q=k`, không còn `page` (về trang 1) |
| 2 | "Sửa hook useProductSearch để danh sách luôn khớp từ khoá mới nhất, huỷ request cũ bằng AbortController" | `src/hooks/useProductSearch.js`: `new AbortController()`, truyền `signal`, cleanup `controller.abort()`, bỏ qua `CanceledError`. AI viết đường dẫn `'/api/products'` | **Sửa** (giữ phần AbortController) | `axiosClient.js` đã có `baseURL: '/api'`, dùng `'/api/products'` sẽ thành `/api/api/products` (404). Đổi thành `'/products'`, `'/categories'` ở mọi file | Chạy mock API chế độ cham, gửi `q=ban` rồi 50 ms sau `q=chuot`. Không huỷ: chuot về ở 170 ms, ban về ở 2507 ms và ghi đè (48 SP "Bàn..."). Có abort: ban báo AbortError, bị bỏ qua; danh sách cuối là chuot (24 SP); log server ghi `q=ban aborted=true` |
| 3 | "Viết CSS để bảng thành thẻ trên màn hình dưới 768px" | `src/App.css`: đặt `display: flex` trực tiếp lên `td` chứa nút Sửa/Xoá | **Sửa** | Trên desktop `td` có `display: flex` không còn là ô bảng, cột Thao tác lệch so với các cột khác. Bọc 2 nút trong `<div className="actions">` và đặt flex cho div | Kiểm tra lại ở 1280px: cột Thao tác thẳng hàng với tiêu đề; ở 375px (DevTools) mỗi sản phẩm là một thẻ, không có thanh cuộn ngang |

## Ghi chú (không tính điểm)

- **Từ khoá chỉ có khoảng trắng:** `trim()` trước khi so sánh và ghi URL, nên "   " được coi là rỗng, không gửi `q` và không gửi request mới.
- **page không hợp lệ** (`page=-3`, `page=abc`, `page=1.5`): đọc bằng `Number`, nếu không phải số nguyên ≥ 1 thì dùng trang 1 (nút Trước bị khoá).
- **page vượt quá số trang** (`page=999`): sau khi tải xong, nếu `page > totalPages` thì cập nhật URL về trang cuối. Cách này cũng xử lý trường hợp xoá sản phẩm cuối cùng của trang cuối.
- **status lạ trên URL** (`status=xyz`): chỉ chấp nhận `active`/`inactive`, còn lại coi là "Tất cả".
- **Bấm Back/Forward:** ô tìm kiếm có state riêng để debounce, được đồng bộ lại theo `q` trên URL mỗi khi URL đổi.
