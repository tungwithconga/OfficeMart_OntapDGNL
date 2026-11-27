import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import ProductListPage from './pages/ProductListPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import './App.css';

export default function App() {
    return (
        <ToastProvider>
            <header className="app-header">
                <span className="brand">OfficeMart Admin</span>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/new" element={<ProductCreatePage />} />
                    <Route path="/products/:id/edit" element={<ProductEditPage />} />
                    <Route path="*" element={<Navigate to="/products" replace />} />
                </Routes>
            </main>
        </ToastProvider>
    );
}
