import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AdminLoginPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminTicketsPage,
  AdminCustomersPage,
  AdminCustomerDetailPage,
  AdminProductsPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/customers" element={<AdminCustomersPage />} />
        <Route path="/customers/:id" element={<AdminCustomerDetailPage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/tickets" element={<AdminTicketsPage />} />
        <Route path="/products" element={<AdminProductsPage />} />
        {/* Catch all - redirect to login or customers */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
