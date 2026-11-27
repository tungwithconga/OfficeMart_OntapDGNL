// HOAN_THIEN: dựng bố cục trang và khai báo các route theo đề (Mục 4.1, 4.2, 4.3).
// Xoá đoạn return bên dưới khi bắt đầu làm bài.
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage.jsx';
import './App.css';

export default function App() {
  return (
    <>
      <header className="app-header">
        <span className="brand">OfficeMart Admin</span>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
        </Routes>
      </main>
    </>
  );
}