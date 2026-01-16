import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AdminLoginPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminTicketsPage,
  AdminCustomersPage,
  AdminCustomerDetailPage,
  AdminProductsPage,
  AdminNotFoundPage,
} from './pages';

function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/customers" element={<AdminCustomersPage />} />
        <Route path="/customers/:id" element={<AdminCustomerDetailPage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/tickets" element={<AdminTicketsPage />} />
        <Route path="/products" element={<AdminProductsPage />} />
        {/* Catch all - 404 */}
        <Route path="*" element={<AdminNotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
